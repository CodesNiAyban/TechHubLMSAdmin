"use client"

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetSchema as ResetSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { reset } from "@/actions/reset";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";

export default function EmailResetPassword() {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: "",
        }
    });

    const onSubmit = async (values: z.infer<typeof ResetSchema>) => {
        setError("");
        setSuccess("");

        startTransition(() => {
            reset(values)
                .then((data) => {
                    setError(data.error)
                    setSuccess(data.success)
                })
        })
    };

    // TODO: MAKE LOGIN CARD A COMPONENT AND IMPROVE UI

    return (
        <div className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden">
            <div className="w-full m-auto bg-white lg:max-w-lg">
                <Card className="p-3">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">Forgot account?</CardTitle>
                        <CardDescription className="text-center">
                            TechHub reset password
                        </CardDescription>
                    </CardHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <CardContent className="grid gap-4">
                                <div className="grid gap-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder="john.doe@email.com"
                                                        type="email" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                </div>
                                <FormError message={error} />
                                <FormSuccess message={success} />
                            </CardContent>
                            <CardFooter className="flex flex-col">
                                <Button type="submit" className="w-full" disabled={isPending}>
                                    {isPending ? "Submitting..." : "Send reset email"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>

                    <p className="mt-2 text-xs text-center text-gray-700 mb-4">
                        <Link className="text-blue-600 hover:underline" href="/auth/login">
                            Back to account login
                        </Link>
                    </p>
                </Card>
            </div>
        </div >
    )
}