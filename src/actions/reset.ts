"use server"

import { resetSchema as ResetSchema } from "@/lib/validation";
import { getUserByEmail } from "@/../data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { z } from "zod";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values);

    if(!validatedFields.success) {
        return { error: "Invalid email"}
    }

    const { email } = validatedFields.data;

    const exisitingUser = await getUserByEmail(email);

    if (!exisitingUser) {
        return { error: "Email not found!"};
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token,
    )

    return { success: "Reset email sent"}
}