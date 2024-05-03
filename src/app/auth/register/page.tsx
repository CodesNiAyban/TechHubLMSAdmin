"use client"

import { register } from "@/actions/register";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
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
import { registerSchema } from "@/lib/validation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import * as z from "zod";

export default function Login() {
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof registerSchema>>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: "",
			password: "",
			name: "",
		}
	});

	const onClick = (provider: "google" | "github") => {
		signIn(provider, {
			callbackUrl: DEFAULT_LOGIN_REDIRECT
		})
	}

	const onSubmit = async (values: z.infer<typeof registerSchema>) => {
		setError("");
		setSuccess("");
		startTransition(() => {
			register(values)
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
						<CardTitle className="text-2xl text-center">Welcome to TechHub!</CardTitle>
						<CardDescription className="text-center">
							Set up your Hub account
						</CardDescription>
					</CardHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<CardContent className="grid gap-4">
								<div className="grid gap-4">
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Name</FormLabel>
												<FormControl>
													<Input
														{...field}
														disabled={isPending}
														placeholder="username" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)} />
								</div>
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
								<div className="grid gap-4">
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input
														{...field}
														disabled={isPending}
														placeholder="••••••••••"
														type="password" />
												</FormControl>
												<FormMessage />
											</FormItem>
										)} />
									<FormError message={error} />
									<FormSuccess message={success} />
								</div>
							</CardContent>
							<CardFooter className="flex flex-col">
								<Button type="submit" className="w-full" disabled={isPending}>
									{isPending ? "Submitting..." : "Create account"}
								</Button>
							</CardFooter>
						</form>
					</Form>

					<div className="relative mb-2">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								Or sign up with
							</span>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4 m-6">
						<Button variant="outline" onClick={() => onClick("google")}>
							<FcGoogle className="mr-2 h-4 w-4" />
							Google
						</Button>
						<Button variant="outline" onClick={() => onClick("github")}>
							<FaGithub className="mr-2 h-4 w-4" />
							GitHub
						</Button>
					</div>


					<p className="mt-2 text-xs text-center text-gray-700 mb-4">
						{"Already have an account? "}
						<Link className="text-blue-600 hover:underline" href="/auth/login">
							Sign in
						</Link>
					</p>
				</Card>
			</div>
		</div >
	)
}