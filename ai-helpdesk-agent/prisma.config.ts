import "dotenv/config";

console.log("DB URL:", process.env.DATABASE_URL);
export default {
  schema: "./prisma/schema.prisma",
  migrations: {
    path: "./prisma/migrations"
  }
};
