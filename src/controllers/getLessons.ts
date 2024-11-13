import { Request, Response } from "express";

import { getLessons } from "../services/getLessons.js";
import { ServiceResponse } from "../types/anca.js";
import {
  GetLessonsBadRequestApplicationJsonResponse,
  GetLessonsQuery,
  Lesson,
} from "../types/openapi.js";

/**
 * Retrieves lessons data
 * @param req
 * @param res
 */
export default async function (
  req: Request<unknown, null, unknown, GetLessonsQuery>,
  res: Response<GetLessonsBadRequestApplicationJsonResponse | Lesson[]>,
) {
  try {
    const result: ServiceResponse<
      GetLessonsBadRequestApplicationJsonResponse | Lesson[],
      200 | 400 | 500,
      "application/json"
    > = await getLessons(req.query);
    res.status(result.code).json(result.data);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
