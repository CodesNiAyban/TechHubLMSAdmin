import crypto from "crypto"
import { v4 as uuidv4 } from "uuid";
import { getVerificationTokenByEmail } from "@/../data/verification-token";
import { getPasswordResetTokenByEmail } from "@/../data/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/../data/two-factor-token"

import prisma from "@/lib/prisma";
import { getTwoFactorConfirmationByUserId } from "../../data/two-factor-confirmation";

export const generateTwoFactorToken = async (email: string) => {
    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000);


    const exisitingToken = await getTwoFactorTokenByEmail(email);

    if (exisitingToken) {
        await prisma.twoFactorToken.delete({
            where: {
                id: exisitingToken.id
            }
        })
    }

    const twoFactorToken = await prisma.twoFactorToken.create({
        data: {
            email,
            token,
            expires
        }
    });

    return twoFactorToken;
}

export const generateTwoFactorConfimationToken = async (email: string, userId: string) => {
    const id = uuidv4();
    const expires = new Date(new Date().getTime() + 3 * 60 * 1000);

    const exisitingToken = await getTwoFactorConfirmationByUserId(userId);

    if (exisitingToken) {
        await prisma.twoFactorConfirmation.delete({
            where: {
                id: exisitingToken.id
            }
        })
    }

    const twoFactorToken = await prisma.twoFactorConfirmation.create({
        data: {
            userId,
            id,
            expires
        }
    });

    return twoFactorToken;
}

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await getPasswordResetTokenByEmail(email);

    if (existingToken) {
        await prisma.passwordResetToken.delete({
            where: { id: existingToken.id }
        })
    }
    {
        const passwordResetToken = await prisma.passwordResetToken.create({
            data: {
                email,
                token,
                expires
            }
        });
        return passwordResetToken;
    }
}

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        await prisma.verificationToken.delete({
            where: {
                id: existingToken.id
            }
        });
    }

    const verificationToken = await prisma.verificationToken.create({
        data: {
            email,
            token,
            expires,
        }
    })

    return verificationToken;
}