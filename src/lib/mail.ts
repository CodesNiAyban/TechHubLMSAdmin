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


export const sendPasswordResetEmail = async (
    email: string,
    token: string
) => {
    const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset Your Password",
        html: `
            <p>Dear TechHub Member,</p>
            
            <p>We have received a request to reset your password for your TechHub account.</p>
            <p>To proceed with resetting your password, please click the link below:</p>
            <p><a href="${resetLink}">Reset Password</a></p>
            <p>If you did not request this change, you can safely ignore this email.</p>
            <p>Warm regards,</p>

            <p>The TechHub Team</p>
        `
    });
}

export const sendVerificationEmail = async (
    email: string,
    token: string
) => {
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Confirm your email",
        html: `
            <p>Dear TechHub Member,</p>
            
            <p>Thank you for joining our vibrant community at TechHub! We're excited to have you on board.</p>
            <p>To ensure the security of your account and access to all our exclusive features, please click the link below to verify your email address:</p>
            <p><a href="${confirmLink}">Verify Email Address</a></p>
            <p>Warm regards,</p>

            <p>The TechHub Team</p>
        `
    });
}
