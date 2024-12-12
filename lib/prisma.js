import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    // Add these options for edge runtime
    datasourceUrl: process.env.DATABASE_URL,
  })
}

const globalForPrisma = globalThis;

export const prisma = 
  globalForPrisma.prisma || 
  prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;