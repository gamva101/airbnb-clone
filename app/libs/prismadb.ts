import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined
}

const client = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV != 'production') globalThis.prisma = client

//nextjs 13 hot reloading craete bunch of prisma client, best practice in nextjs 13
export default client;