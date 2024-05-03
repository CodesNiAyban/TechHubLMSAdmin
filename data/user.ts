import prisma from "@/lib/prisma";

export const getUserByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        console.log("ETO YUN " + user)
        return user;
    } catch (error) {
        console.error('Error occurred while fetching user by email:', error);
        return null;
    }
}

export const getUserByID = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        return user;
    } catch (error) {
        console.error('Error occurred while fetching user by id:', error);
        return null;
    }
}
