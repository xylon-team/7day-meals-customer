import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// Singleton pattern: reuse existing instance or create new one
// In production: module caching ensures single instance (process doesn't restart)
// In development: global storage ensures single instance across hot-reloads
export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
