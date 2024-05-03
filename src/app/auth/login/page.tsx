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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot
} from "@/components/ui/input-otp";
import { loginSchema } from "@/lib/validation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Lottie from "react-lottie";
import * as z from "zod";
import * as animationData from '../../../../public/assets/login.json';

export default function Login() {
	const [showTwoFactor, setShowTwoFactor] = useState(false);
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const [isPending, startTransition] = useTransition();

	const searchParams = useSearchParams();
	const urlError = searchParams.get("error") === "OAuthAccountNotlinked"
		? "Email already in use with different provider" : "";

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		}
	})

	const onClick = (provider: "google" | "github") => {
		signIn(provider, {
			callbackUrl: DEFAULT_LOGIN_REDIRECT
		})
	}

	const onSubmit = async (values: z.infer<typeof loginSchema>) => {
		setError("");
		setSuccess("");
		startTransition(() => {
			login(values)
				.then((data) => {
					if (data?.error) {
						if (!showTwoFactor) form.reset();
						setError(data.error);
					}

					if (data?.success) {
						if (!showTwoFactor) form.reset();
						setSuccess(data.success);
					}

					if (data?.twoFactor) {
						setShowTwoFactor(true)
					}
				})
				.catch(() => setError("Something went wrong"));
		});
	};

	// TODO: MAKE LOGIN CARD A COMPONENT AND IMPROVE UI

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
			<div className="w-full m-auto bg-white lg:max-w-lg">
				<Card className="p-3">
					<CardHeader className="space-y-1">
						<CardTitle className="text-2xl text-center">Sign in to TechHub</CardTitle>
						<CardDescription className="text-center space-y-4 ">
							Login to TechHub for instant access to our learning community
						</CardDescription>
					</CardHeader>
					{!showTwoFactor ?
						(<>
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
											<Link
												href="/auth/reset"
												className="ml-auto inline-block text-sm underline"
											>
												Forgot your password?
											</Link>
											<FormError message={error || urlError} />
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
								{"New to TechHub? "}
								<Link className="text-blue-600 hover:underline" href="/auth/register">
									Create an account
								</Link>
							</p>

						</>) :
						(<>
							{/**
 							* TODO: FIX ERROR UI/UX where it doesnt go away
 							*/}
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
									<CardContent className="grid gap-4">
										<div className="grid justify-center"> {/* Added justify-center to center the OTP input */}
											<FormField
												control={form.control}
												name="code"
												render={({ field }) => (
													<FormItem>
														<FormLabel className="grid justify-center">Two Factor Authentication</FormLabel>
														<FormControl>
															<div className="flex justify-center">
																<InputOTP maxLength={6} {...field} disabled={isPending}>
																	<InputOTPGroup>
																		<InputOTPSlot index={0} />
																		<InputOTPSlot index={1} />
																		<InputOTPSlot index={2} />
																		<InputOTPSlot index={3} />
																		<InputOTPSlot index={4} />
																		<InputOTPSlot index={5} />
																	</InputOTPGroup>
																</InputOTP>
															</div>
														</FormControl>
														<FormDescription className="grid justify-center">
															Please enter the code sent to your email.
														</FormDescription>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<div className="grid gap-4 justify-center">
											<FormError message={error || urlError} />
											<FormSuccess message={success} />
										</div>
									</CardContent>
									<CardFooter className="flex flex-col">
										<Button type="submit" className="w-full" disabled={isPending}>
											{isPending ? "Submitting..." : "Confirm"}
										</Button>
									</CardFooter>
								</form>
							</Form>

						</>)
					}
				</Card>
			</div>
		</div>
	)
}
