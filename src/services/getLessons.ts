/* eslint-disable sonarjs/no-duplicate-string */
import knex from "../config/database.js";
import { ServiceResponse } from "../types/anca.js";
import {
  GetLessonsBadRequestApplicationJsonResponse,
  GetLessonsQuery,
  Lesson,
} from "../types/openapi.js";
import { parseArrayString } from "../utils/array.js";
import { validateDate } from "../utils/date.js";

/**
 * Retrieves lessons data
 * @param query
 */
export async function getLessons(
  query: GetLessonsQuery,
): Promise<
  ServiceResponse<
    GetLessonsBadRequestApplicationJsonResponse | Lesson[],
    200 | 400 | 500,
    "application/json"
  >
> {
  try {
    const dateArray = query.date && query.date.split(",");

    if (
      dateArray &&
      ((dateArray.length !== 1 && dateArray.length !== 2) ||
        !dateArray.every(validateDate))
    ) {
      return {
        code: 400,
        data: {
          error:
            "Invalid date format or date doesn't exist. Use YYYY-MM-DD or YYYY-MM-DD,YYYY-MM-DD.",
        },
        type: "application/json",
      };
    }

    const status = query.status ? parseInt(query.status) : null;

    if (status != null && status !== 0 && status !== 1) {
      return {
        code: 400,
        data: {
          error: "Invalid status. Use 0 (not conducted) or 1 (conducted).",
        },
        type: "application/json",
      };
    }

    const teacherIds = parseArrayString(query.teacherIds);

    if (!teacherIds.empty && !teacherIds.valid) {
      return {
        code: 400,
        data: {
          error:
            "Invalid teacherIds format. Use a single number or two numbers separated by a comma.",
        },
        type: "application/json",
      };
    }

    const studentsCount = parseArrayString(query.studentsCount, 2);

    if (!studentsCount.empty && !studentsCount.valid) {
      return {
        code: 400,
        data: {
          error:
            "Invalid studentsCount format. Use a single number or two numbers separated by a comma.",
        },
        type: "application/json",
      };
    }

    const page = query.page ? parseInt(query.page) : 1;

    if (!Number.isInteger(page) || page < 1) {
      return {
        code: 400,
        data: { error: "Invalid page number. Use a positive integer." },
        type: "application/json",
      };
    }

    const lessonsPerPage = query.lessonsPerPage
      ? parseInt(query.lessonsPerPage)
      : 5;

    if (!Number.isInteger(lessonsPerPage) || lessonsPerPage < 1) {
      return {
        code: 400,
        data: { error: "Invalid lessonsPerPage. Use a positive integer." },
        type: "application/json",
      };
    }

    const dateRange = dateArray || [];
    const studentsCountRange = query.studentsCount
      ? query.studentsCount.split(",")
      : [];

    const knexQuery = knex("lessons")
      .with("student_counts", (k) => {
        return k
          .select(
            "lessons.id AS lesson_id",
            knex.raw(
              "COUNT(DISTINCT lesson_students.student_id) AS student_count",
            ),
          )
          .from("lessons")
          .leftJoin(
            "lesson_students",
            "lesson_students.lesson_id",
            "lessons.id",
          )
          .groupBy("lessons.id");
      })
      .select(
        "lessons.id",
        "lessons.date",
        "lessons.title",
        "lessons.status",
        knex.raw(
          `CAST(COUNT(DISTINCT CASE WHEN lesson_students.visit IS TRUE THEN students.id END) AS integer) AS "visitCount"`,
        ),
        knex.raw(
          "COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', teachers.id, 'name', teachers.name)) FILTER (WHERE teachers.id IS NOT NULL), '[]') AS teachers",
        ),
        knex.raw(
          "COALESCE(jsonb_agg(DISTINCT jsonb_build_object('id', students.id, 'name', students.name, 'visit', lesson_students.visit)) FILTER (WHERE students.id IS NOT NULL), '[]') AS students",
        ),
      )
      .leftJoin(
        "lesson_teachers as lesson_teachers_check",
        "lesson_teachers_check.lesson_id",
        "lessons.id",
      )
      .leftJoin("lesson_teachers", "lesson_teachers.lesson_id", "lessons.id")
      .leftJoin("teachers", "lesson_teachers.teacher_id", "teachers.id")
      .leftJoin("lesson_students", "lesson_students.lesson_id", "lessons.id")
      .leftJoin("students", "lesson_students.student_id", "students.id")
      .leftJoin("student_counts", "student_counts.lesson_id", "lessons.id")
      .groupBy("lessons.id");

    if (dateRange.length === 2) {
      knexQuery.whereBetween("lessons.date", [dateRange[0], dateRange[1]]);
    } else if (dateRange.length === 1) {
      knexQuery.where("lessons.date", dateRange[0]);
    }

    if (status != null) {
      knexQuery.where("lessons.status", query.status);
    }

    if (teacherIds.array.length > 0) {
      knexQuery.whereIn("lesson_teachers_check.teacher_id", teacherIds.array);
    }

    if (studentsCountRange.length === 2) {
      knexQuery.whereBetween("student_count", [
        studentsCountRange[0],
        studentsCountRange[1],
      ]);
    } else if (studentsCountRange.length === 1) {
      knexQuery.where("student_count", studentsCountRange[0]);
    }

    knexQuery.limit(lessonsPerPage).offset(lessonsPerPage * (page - 1));

    const data = await knexQuery;

    return { code: 200, data, type: "application/json" };
  } catch (error) {
    console.error(error);
    return {
      code: 500,
      data: { error: "Internal Server Error" },
      type: "application/json",
    };
  }
}
