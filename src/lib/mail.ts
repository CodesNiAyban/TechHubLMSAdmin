// utils/email/sendVerificationEmail.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export const sendTwoFactorTokenEmail = async (
    email: string,
    token: string
) => {
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "2FA Code",
        html: `
            <p>Dear User,</p>
            
            <p>Your authentication code for TechHub:</p>
            <h2 style="font-size: 24px; font-weight: bold;">${token}</h2>
            
            <p>This code will expire in 10 minutes. Please do not share it with anyone.</p>
            
            <p>If you did not request this code, you can safely ignore this email.</p>
            
            <p>Warm regards,</p>
            <p>The TechHub Team</p>
        `
    });
}
