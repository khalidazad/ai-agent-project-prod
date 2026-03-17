// import prisma client
import { PrismaClient } from "@prisma/client";

// create singleton instance
const prisma = new PrismaClient();

export default prisma;