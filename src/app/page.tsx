"use client"
import { login } from "@/actions/login";
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
import { loginSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Router from "next/router";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Lottie from "react-lottie";
import * as z from "zod";
import * as animationData from '../../public/assets/login.json';

export default function Login() {
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		}
	})

	const onSubmit = async (values: z.infer<typeof loginSchema>) => {
		setError("");
		setSuccess("");
		startTransition(() => {
			login(values)
				.then((data) => {
					setError(data?.error)
					// setSuccess(data?.success!)
					// if (!data?.error) {
					// 	Router.push('/dashboard'); // Change '/dashboard' to your desired destination
					// }
				})
		})
	};

	// TODO: DECIDE IF REMOVE THIS OR MAINTAIN

	return (
		<div className="h-screen flex bg-gray-50">
			<div className="w-1/2 relative overflow-hidden">
				<Lottie
					options={{
						loop: true,
						autoplay: true,
						animationData: animationData,
						rendererSettings: {
							preserveAspectRatio: 'xMidYMid slice'
						}
					}}
					speed={0.25}
					height={'100%'}
					width={'100%'}
					style={{
						position: 'relative',
						top: 0,
						left: 0,
						zIndex: 0,
					}}
				/>
			</div>
			<div className="w-1/2 flex justify-center items-center">
				<Card className="p-14">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl text-center">Sign in to TechHub</CardTitle>
						<CardDescription className="text-center space-y-4 ">
							Login to TechHub for instant access to our learning community
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
									{isPending ? "Submitting..." : "Login"}
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
								Or continue with
							</span>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-4 m-6">
						<Button variant="outline">
							<FcGoogle className="mr-2 h-4 w-4" />
							Google
						</Button>
						<Button variant="outline">
							<FaGithub className="mr-2 h-4 w-4" />
							GitHub
						</Button>
					</div>

					<p className="mt-2 text-xs text-center text-gray-700 mb-4">
						{"New to TechHub? "}
						<Link className="text-blue-600 hover:underline" href="/auth/register">
							Create an account
						</Link>
					</p>
				</Card>
			</div>
		</div>
	)
}
