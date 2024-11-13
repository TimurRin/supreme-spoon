import "dotenv/config";

const knexConfig = {
  client: "pg",
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: "./migrations",
    loadExtensions: [".js"],
    tableName: "cinnabar_migrations",
  },
};

export default {
  development: knexConfig,
  testing: knexConfig,
  production: knexConfig,
};
