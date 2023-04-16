import prisma from "@/app/libs/prismadb";
import { list } from "postcss";

export default async function getListings() {
    try {
        const listings = await prisma.listing.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
        return listings;
    } catch (error: any) {
        throw new Error(error);
    }
}