"use client"

import { CardWrapper } from "@/components/auth/card-wrapper"

import { useSearchParams } from "next/navigation"

import { PropagateLoader } from "react-spinners"

import { useCallback, useEffect, useState } from "react"

import { newVerification } from "@/actions/new-verification"

import { FormError } from "@/components/auth/form-error"

import { FormSuccess } from "@/components/auth/form-success"

export const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (!token) {
            setError("Error missing token");
            return;
        }
        newVerification(token)
            .then((data) => {
                setSuccess(data.success);
                setError(data.error);
            })
            .catch(() => {
                setError("Something went wrong")
            })
    }, [token])

    useEffect(() => {
        onSubmit();
    }, [onSubmit])

    return (
        <CardWrapper
            headerLabel="Verification confirmation"
            backButtonHref="/auth/login"
            backButtonLabel="Back to login"
        >
            <div className="space-y-6 flex items-center w-full justify-center">
                {!success && !error && (
                    <PropagateLoader />
                )}
                <FormSuccess message={success} />
                <FormError message={error} />
            </div >
        </CardWrapper>
    )
}