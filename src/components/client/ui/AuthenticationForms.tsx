"use client";
import { getRoute } from "@/lib/utils";
import { Decrypt, Encrypt, LoadPrivateRSAKey, LoadPublicRSAKey, Base64Decode, Base64Encode } from "@/lib/crypto/crypto";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "@/components/router/Link";


const publicApiRSAKeyPEM: string = process.env.NEXT_PUBLIC_API_PUBLIC_KEY!;
const privateFrontEndRSAKeyPEM: string = process.env.NEXT_PUBLIC_FRONTEND_PRIVATE_KEY!;
const RSAKeysPassword: string = process.env.NEXT_PUBLIC_KEYS_PASSWORD!;

const publicAPIRSAKey = LoadPublicRSAKey(publicApiRSAKeyPEM);
const privateFrontendRSAKey = LoadPrivateRSAKey(privateFrontEndRSAKeyPEM, RSAKeysPassword);


const loginSchema = z.object({
    email: z.string().email({
        message: "Please provide a valid email.",
    }),
    password: z.string().min(1, {
        message: "Please provide a password.",
    }).min(8, {
        message: "The password has at least 8 characters.",
    }),
})


export function LoginForm() {
    const [loggedIn, setLoggedIn] = useState<string>("");

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        const result = loginSchema.safeParse(values);
        if (!result.success) {
            const errors = result.error.errors;
            // Find the first invalid section
            console.log(errors)
        }

        const email: string = result.data?.email!;
        const password: string = result.data?.password!;
        const encryptedEmail: string = Encrypt(publicAPIRSAKey, email);
        const encryptedPassword: string = Encrypt(publicAPIRSAKey, password);

        const loginResponse = await fetch(getRoute(`/api/login`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: Base64Encode(encryptedEmail), password: Base64Encode(encryptedPassword) })
        });

        if (!loginResponse.ok) {
            throw new Error("[POST onSubmit] Network response was not ok");
        }

        const loginResult = await loginResponse.json();

        const responseEncodedEncryptedToken: string = loginResult?.token!;
        const decodedToken: string = Base64Decode(responseEncodedEncryptedToken);
        const decryptedToken: string = Decrypt(privateFrontendRSAKey, decodedToken);
        setLoggedIn(decryptedToken);
    }

    return (
        <Form {...form}>
            <h1 className="text-center w-full font-bold text-3xl mb-8">Login</h1>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-3/5">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input className="w-full" placeholder="Insert your email" type="email" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your login email.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input className="w-full" placeholder="Insert your password" type="password"  {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your login password.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div>
                    <Button type="submit" className="w-full mb-2 mt-4 transition-all">
                        Log In
                    </Button>
                    <div className="mx my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-neutral-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-neutral-400 before:dark:bg-neutral-600 after:dark:bg-neutral-600">
                        or
                    </div>
                    <p className="text-center my-2 text-sm rounded-md px-3 text-neutral-600">If you don{"'"}t have an account please <Link href="/signup" className="text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50 transition-all">Sign Up</Link></p>
                </div>
            </form>
        </Form>
    )
} 

export function SignUpForm() {
    const [loggedIn, setLoggedIn] = useState<string>("");

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        const result = loginSchema.safeParse(values);
        if (!result.success) {
            const errors = result.error.errors;
            // Find the first invalid section
            console.log(errors)
        }

        const email: string = result.data?.email!;
        const password: string = result.data?.password!;
        const encryptedEmail: string = Encrypt(publicAPIRSAKey, email);
        const encryptedPassword: string = Encrypt(publicAPIRSAKey, password);

        const loginResponse = await fetch(getRoute(`/api/login`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: Base64Encode(encryptedEmail), password: Base64Encode(encryptedPassword) })
        });

        if (!loginResponse.ok) {
            throw new Error("[POST onSubmit] Network response was not ok");
        }

        const loginResult = await loginResponse.json();

        const responseEncodedEncryptedToken: string = loginResult?.token!;
        const decodedToken: string = Base64Decode(responseEncodedEncryptedToken);
        const decryptedToken: string = Decrypt(privateFrontendRSAKey, decodedToken);
        setLoggedIn(decryptedToken);
    }

    return (
        <Form {...form}>
            <h1 className="text-center w-full font-bold text-3xl mb-8">Sign Up</h1>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-3/5">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input className="w-full" placeholder="Insert your email" type="email" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your login email.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input className="w-full" placeholder="Insert your password" type="password"  {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your login password.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div>
                    <Button type="submit" className="w-full mb-2 mt-4 transition-all">
                        Log In
                    </Button>
                    <div className="mx my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-neutral-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-neutral-400 before:dark:bg-neutral-600 after:dark:bg-neutral-600">
                        or
                    </div>
                    <p className="text-center my-2 text-sm rounded-md px-3 text-neutral-600">If you have an account please <Link href="/login" className="text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50 transition-all">Sign Up</Link></p>
                </div>
            </form>
        </Form>
    )
} 
