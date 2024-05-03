import { PrismaClient } from "@prisma/client"
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon"

const prismaClient = () => {
  const neon = new Pool({connectionString: process.env.POSTGRES_PRISMA_URL})
  const adapter = new PrismaNeon(neon);
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClient>;
}

const prisma = globalThis.prismaGlobal ?? prismaClient();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
