"use server"
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import bcrypt from "bcrypt";
import { AuthError } from "next-auth";
import * as z from "zod";

import { loginSchema } from "@/lib/validation";

import { getTwoFactorTokenByEmail } from "../../data/two-factor-token";

import {
    sendTwoFactorTokenEmail,
    sendVerificationEmail
} from "@/lib/mail";
import prisma from "@/lib/prisma";
import {
    generateTwoFactorConfimationToken,
    generateTwoFactorToken,
    generateVerificationToken
} from "@/lib/tokens";
import { getTwoFactorConfirmationByUserId } from "../../data/two-factor-confirmation";
import { getUserByEmail } from "../../data/user";

export const login = async (values: z.infer<typeof loginSchema>) => {
    const validatedFields = loginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password, code } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: "Email does not exist" }
    }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        )

        return { success: "Email still not verified, please verify with the email sent" }
    }

    if (existingUser.isTwoFactorEnabled && existingUser.email && existingUser.password) {
        const passwordsMatch = await bcrypt.compare(password, existingUser.password);
        if (passwordsMatch) {
            if (code && code.length > 0) {
                const twoFactorToken = await getTwoFactorTokenByEmail(
                    existingUser.email
                )

                if (!twoFactorToken) {
                    return { error: "No code found, please try again" }
                }

                if (twoFactorToken.token !== code) {
                    return { error: "Invalid code" }
                }

                const hasExpired = new Date(twoFactorToken.expires) < new Date();

                if (hasExpired) {
                    return { error: "Code expired" } // TODO: Expiration handling
                }

                await prisma.twoFactorToken.delete({
                    where: { id: twoFactorToken.id }
                })

                // const exisitingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

                // if (exisitingConfirmation && exisitingConfirmation.expires < new Date()) {
                //     await prisma.twoFactorConfirmation.delete({
                //         where: { id: exisitingConfirmation.id }
                //     })
                //     await generateTwoFactorConfimationToken(email, existingUser.id)
                // }

                // if (!exisitingConfirmation) {
                //     await generateTwoFactorConfimationToken(email, existingUser.id)
                // }
                await generateTwoFactorConfimationToken(email, existingUser.id);

            } else {
                let exisitingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

                if (exisitingConfirmation && exisitingConfirmation.expires < new Date()) {
                    await prisma.twoFactorConfirmation.delete({
                        where: { id: exisitingConfirmation.id }
                    })
                    exisitingConfirmation = null;
                }

                if (!exisitingConfirmation) {
                    const twoFactorToken = await generateTwoFactorToken(existingUser.email)

                    await sendTwoFactorTokenEmail(
                        twoFactorToken.email,
                        twoFactorToken.token,
                    )

                    return { twoFactor: true }
                }
            }
        } else {
            return { error: "Invalid credentials" }
        }
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" };
                default:
                    return { error: "Something went wrong" };
            }
        }
        throw error;
    }
};
