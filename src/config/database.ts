import knex from "knex";

export default knex({
  client: "pg",
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: "./migrations",
    loadExtensions: [".js"],
    tableName: "cinnabar_migrations",
  },
});
