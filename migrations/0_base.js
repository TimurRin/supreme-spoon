export async function up(knex) {
  await knex.schema.createTable("lessons", (table) => {
    table.increments("id").primary();
    table.date("date").notNullable();
    table.string("title", 100);
    table.integer("status").defaultTo(0);
  });

  await knex.schema.createTable("students", (table) => {
    table.increments("id").primary();
    table.string("name", 10);
  });

  await knex.schema.createTable("teachers", (table) => {
    table.increments("id").primary();
    table.string("name", 10);
  });

  await knex.schema.createTable("lesson_students", (table) => {
    table.integer("lesson_id").references("id").inTable("lessons");
    table.integer("student_id").references("id").inTable("students");
    table.boolean("visit").defaultTo(false);
  });

  await knex.schema.createTable("lesson_teachers", (table) => {
    table.integer("lesson_id").references("id").inTable("lessons");
    table.integer("teacher_id").references("id").inTable("teachers");
  });

  await knex.schema.table("lessons", (table) => {
    table.index(["date", "status"]);
  });

  await knex.schema.table("lesson_teachers", (table) => {
    table.index(["lesson_id", "teacher_id"]);
  });

  await knex.schema.table("lesson_students", (table) => {
    table.index(["lesson_id", "student_id", "visit"]);
  });

  await knex.schema.table("teachers", (table) => {
    table.index(["id", "name"]);
  });

  await knex.schema.table("students", (table) => {
    table.index(["id", "name"]);
  });

  await knex("lessons").insert([
    { id: 2, date: "2019-09-02", title: "Red Color", status: 0 },
    { id: 5, date: "2019-05-10", title: "Purple Color", status: 0 },
    { id: 7, date: "2019-06-17", title: "White Color", status: 0 },
    { id: 10, date: "2019-06-24", title: "Brown Color", status: 0 },
    { id: 9, date: "2019-06-20", title: "Yellow Color", status: 1 },
    { id: 1, date: "2019-09-01", title: "Green Color", status: 1 },
    { id: 3, date: "2019-09-03", title: "Orange Color", status: 1 },
    { id: 4, date: "2019-09-04", title: "Blue Color", status: 1 },
    { id: 6, date: "2019-05-15", title: "Red Color", status: 1 },
    { id: 8, date: "2019-06-17", title: "Black Color", status: 1 },
  ]);

  await knex("students").insert([
    { id: 1, name: "Ivan" },
    { id: 2, name: "Sergey" },
    { id: 3, name: "Maxim" },
    { id: 4, name: "Slava" },
  ]);

  await knex("teachers").insert([
    { id: 1, name: "Sveta" },
    { id: 2, name: "Marina" },
    { id: 3, name: "Angelina" },
    { id: 4, name: "Masha" },
  ]);

  await knex("lesson_students").insert([
    { lesson_id: 1, student_id: 1, visit: true },
    { lesson_id: 1, student_id: 2, visit: true },
    { lesson_id: 1, student_id: 3, visit: false },
    { lesson_id: 2, student_id: 2, visit: true },
    { lesson_id: 2, student_id: 3, visit: true },
    { lesson_id: 4, student_id: 1, visit: true },
    { lesson_id: 4, student_id: 2, visit: true },
    { lesson_id: 4, student_id: 3, visit: true },
    { lesson_id: 4, student_id: 4, visit: true },
    { lesson_id: 5, student_id: 4, visit: false },
    { lesson_id: 5, student_id: 2, visit: false },
    { lesson_id: 6, student_id: 1, visit: false },
    { lesson_id: 6, student_id: 3, visit: false },
    { lesson_id: 7, student_id: 2, visit: true },
    { lesson_id: 7, student_id: 1, visit: true },
    { lesson_id: 8, student_id: 1, visit: false },
    { lesson_id: 8, student_id: 4, visit: true },
    { lesson_id: 8, student_id: 2, visit: true },
    { lesson_id: 9, student_id: 2, visit: false },
    { lesson_id: 10, student_id: 1, visit: false },
    { lesson_id: 10, student_id: 3, visit: true },
  ]);

  await knex("lesson_teachers").insert([
    { lesson_id: 1, teacher_id: 1 },
    { lesson_id: 1, teacher_id: 3 },
    { lesson_id: 2, teacher_id: 1 },
    { lesson_id: 2, teacher_id: 4 },
    { lesson_id: 3, teacher_id: 3 },
    { lesson_id: 4, teacher_id: 4 },
    { lesson_id: 6, teacher_id: 3 },
    { lesson_id: 7, teacher_id: 1 },
    { lesson_id: 8, teacher_id: 4 },
    { lesson_id: 8, teacher_id: 3 },
    { lesson_id: 8, teacher_id: 2 },
    { lesson_id: 9, teacher_id: 3 },
    { lesson_id: 10, teacher_id: 3 },
  ]);
}

export async function down(knex) {
  await knex.schema.dropTable("lesson_teachers");
  await knex.schema.dropTable("lesson_students");
  await knex.schema.dropTable("teachers");
  await knex.schema.dropTable("students");
  await knex.schema.dropTable("lessons");
}
