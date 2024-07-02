"use client";
import { getRoute } from "@/lib/utils";
import { Decrypt, Encrypt, LoadPrivateRSAKey, LoadPublicRSAKey, Base64Decode, Base64Encode, EncryptEncode, DecodeDecrypt, DecryptFromEncryptTo } from "@/lib/crypto/crypto";
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
import { useEffect, useMemo, useState } from "react";
import { Link } from "@/components/router/Link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/app/contexts/UserContext";


const publicApiRSAKeyPEM: string = process.env.NEXT_PUBLIC_API_PUBLIC_KEY!;
const privateFrontEndRSAKeyPEM: string = process.env.NEXT_PUBLIC_FRONTEND_PRIVATE_KEY!;
const RSAKeysPassword: string = process.env.NEXT_PUBLIC_KEYS_PASSWORD!;

const publicAPIRSAKey = LoadPublicRSAKey(publicApiRSAKeyPEM);
const privateFrontendRSAKey = LoadPrivateRSAKey(privateFrontEndRSAKeyPEM, RSAKeysPassword);
const specialCharacters = '!@#$%&*()_\\-+=.';



export function LoginForm() {
    const router = useRouter();
    const { setToken, token } = useUserContext();
    const [resp, setResp] = useState<{ token: string }>({} as { token: string });

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


    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const fetchLogin = async (email: string, password: string): Promise<string> => {
        const loginResponse = await fetch(getRoute(`/api/login`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: Base64Encode(email), password: Base64Encode(password) })
        });

        if (!loginResponse.ok) {
            throw new Error("[POST onSubmit] Network response was not ok");
        }

        const responseJSON: { token: string } = await loginResponse.json();
        const authToken: string = DecodeDecrypt(privateFrontendRSAKey, responseJSON.token);
        return authToken;
    }

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        const result = loginSchema.safeParse(values);
        if (!result.success) {
            const errors = result.error.errors;
            console.log(errors)
        }

        const email: string = result.data?.email!;
        const password: string = result.data?.password!;
        const encryptedEmail: string = Encrypt(publicAPIRSAKey, email);
        const encryptedPassword: string = Encrypt(publicAPIRSAKey, password);

        try {
            const authToken: string = await fetchLogin(encryptedEmail, encryptedPassword);
            setToken(authToken);
        } catch (error) {
            console.error('There has been a problem with the fetch operation:', error);
        }
    }

    useEffect(() => {
        if (token) {
            router.push("/home.html");
        }
    }, [token, router]);

    return (
        <Form {...form}>
            <h1 className="text-center w-full font-bold text-3xl mb-8">Login</h1>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-3/5">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="mt-2 h-36">
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
                        <FormItem className="mt-2 h-36">
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
                    <Button type="submit" className="w-full mb-2 mt-4 h-12 transition-all">
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
    const TOTAL_SIGNUP_SECTIONS = 2;
    const [section, setSection] = useState<number>(0);
    const [finalizedSignUp, setFinalizedSignUp] = useState<boolean>(false);
    const router = useRouter();
    const { setToken, token } = useUserContext();

    const signupSchema = useMemo(() => z.object({
        firstname: z.string().min(1, 'Please provide your first name.')
            .min(2, 'First name must have at least 2 characters.')
            .max(64, 'First name can only have the maximum of 64 characters.')
            .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain alphanumeric characters and underscore.'),
        lastname: z.string().min(1, 'Please provide your last name.')
            .min(2, 'Last name must have at least 2 characters.')
            .max(64, 'Last name can only have the maximum of 64 characters.')
            .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain alphanumeric characters and underscore.'),
        email: z.string().email('Please provide a valid email address.').optional(),
        reemail: z.string().email('Please provide a valid email address.').optional(),
        password: z.string().min(1, 'Please provide a password')
            .min(8, 'Password must have at least 8 characters')
            .max(64, 'Password can only have the maximum of 64 characters.')
            .refine(password => /[A-Z]/.test(password), {
                message: "Password must have at least one uppercase letter"
            })
            .refine(password => /[a-z]/.test(password), {
                message: "Password must have at least one lowercase letter"
            })
            .refine(password => !/\s/.test(password), {
                message: "Password cannot contain spaces"
            })
            .refine(password => new RegExp(`[${specialCharacters}]`).test(password), {
                message: `Password must contain at least one special character: ${specialCharacters}`
            }),
        repassword: z.string().min(1, 'Please provide a password')
            .min(8, 'Password must have at least 8 characters')
            .max(64, 'Password can only have the maximum of 64 characters.')
            .refine(password => /[A-Z]/.test(password), {
                message: "Password must have at least one uppercase letter"
            })
            .refine(password => /[a-z]/.test(password), {
                message: "Password must have at least one lowercase letter"
            })
            .refine(password => !/\s/.test(password), {
                message: "Password cannot contain spaces"
            })
            .refine(password => new RegExp(`[${specialCharacters}]`).test(password), {
                message: `Password must contain at least one special character: ${specialCharacters}`
            }),
    }), []);


    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        mode: 'onChange',
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            reemail: "",
            password: "",
            repassword: ""
        },
    })


    const checkSection = async (section: number) => {
        switch (section) {
            case 0:
                const result0 = await form.trigger("firstname");
                const result1 = await form.trigger("lastname");
                return result0 && result1;
            case 1:
                const result2 = await form.trigger("email");
                const result3 = await form.trigger("reemail");
                return result3 && result2;

            case 2:
                const result4 = await form.trigger("password");
                const result5 = await form.trigger("repassword");
                return result4 && result5;
            default:
                break;
        }
    }

    const advanceSection = async () => {
        const sectionIsValid = await checkSection(section);
        if (sectionIsValid && section < TOTAL_SIGNUP_SECTIONS) {
            setSection(section + 1);
        }
    };

    useEffect(() => {
        if (section == TOTAL_SIGNUP_SECTIONS) {
            setFinalizedSignUp(true);
        }
    }, [section, setFinalizedSignUp])

    const returnSection = () => {
        if (section > 0) {
            setSection(section - 1);
        }

        setFinalizedSignUp(false);
    }

    const sendSignUp = async (email: string, password: string, firstName: string, lastName: string): Promise<string> => {
        const response = await fetch(getRoute(`/api/signup`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password, firstName: firstName, lastName: lastName })
        });

                        
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const authTokenEncodedEncrypted = await response.json();
        const authToken: string = DecodeDecrypt(privateFrontendRSAKey, authTokenEncodedEncrypted.token);

        return authToken;
    }

    async function onSubmit(values: z.infer<typeof signupSchema>) {
        const result = signupSchema.safeParse(values);
        if (!result.success) {
            const errors = result.error.errors;
            console.log(errors);
            let firstInvalidSection = -1;
            for (let i = 0; i < errors.length; i++) {
                const errorPath = errors[i].path[0];
                if (errorPath === "firstname" || errorPath === "lastname") {
                    firstInvalidSection = 0;
                    break;
                } else if (errorPath === "email" || errorPath === "reemail") {
                    firstInvalidSection = 1;
                    break;
                } else if (errorPath === "password" || errorPath === "repassword") {
                    firstInvalidSection = 2;
                    break;
                }
            }
            if (firstInvalidSection !== -1) {
                setSection(firstInvalidSection);
                return;
            }
        }

        try {
            const e = result?.data?.email!;
            const p = result?.data?.password!;
            const fn = result?.data?.firstname!;
            const ln = result?.data?.lastname!;
            if (e !== undefined && p !== undefined && fn !== undefined && ln !== undefined) {
                const email = EncryptEncode(publicAPIRSAKey, e);
                const password = EncryptEncode(publicAPIRSAKey, p);
                const firstName = EncryptEncode(publicAPIRSAKey, fn);
                const lastName = EncryptEncode(publicAPIRSAKey, ln);

                const authToken = await sendSignUp(email, password, firstName, lastName);
                setToken(authToken);
            }
        } catch (error: any) {
            console.error("Fetch error: ", error.message);
        }
    }

    useEffect(() => {
        if (token) {
            router.push("/home.html");
        }
    }, [token, router]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-3/5">
                <h1 className="text-center w-full font-bold text-3xl mb-8">Sign Up</h1>
                <div>
                    {section === 0 && (
                        <>
                            <FormField
                                control={form.control}
                                name="firstname"
                                render={({ field }: any) => (
                                    <FormItem className="mt-2 h-36">
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="text" />
                                        </FormControl>
                                        <FormDescription>
                                            This is your first name
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastname"
                                render={({ field }: any) => (
                                    <FormItem className="mt-2 h-36">
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="text" />
                                        </FormControl>
                                        <FormDescription>
                                            This is your last name
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                    {section === 1 && (
                        <>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }: any) => (
                                    <FormItem className="mt-2 h-36">
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="email" />
                                        </FormControl>
                                        <FormDescription>
                                            This is your account email
                                        </FormDescription>
                                        <FormMessage className="" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="reemail"
                                render={({ field }: any) => (
                                    <FormItem className="mt-2 h-36">
                                        <FormLabel>Confirm Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="email" />
                                        </FormControl>
                                        <FormDescription>
                                            Please confirm your email
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                    {section === 2 && (
                        <>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }: any) => (
                                    <FormItem className="mt-2 h-36">
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" />
                                        </FormControl>
                                        <FormDescription>
                                            This is your account password
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="repassword"
                                render={({ field }: any) => (
                                    <FormItem className="mt-2 h-36">
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" />
                                        </FormControl>
                                        <FormDescription>
                                            Please confirm your password
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                </div>

                <div>
                    <div className="w-full mb-2 flex justify-between mt-4 h-12 transition-all">
                        <Button className="transition-all" type="button" variant={(section == 0) ? "outline" : "default"} size="icon" onClick={returnSection} disabled={section == 0}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button type={finalizedSignUp ? "submit" : "button"} disabled={!finalizedSignUp} className="grow mx-2 transition-all">
                            {finalizedSignUp ? 'Sign Up' : `${section + 1}/${TOTAL_SIGNUP_SECTIONS + 1}`}
                        </Button>
                        <Button className="transition-all" type="button" variant={finalizedSignUp ? "outline" : "default"} size="icon" onClick={advanceSection} disabled={finalizedSignUp}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="mx my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-neutral-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-neutral-400 before:dark:bg-neutral-600 after:dark:bg-neutral-600">
                        or
                    </div>
                    <p className="text-center my-2 text-sm rounded-md px-3 text-neutral-600">If you already have an account please <Link href="/login" className="text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-50 transition-all">Log In</Link></p>
                </div>
            </form>
        </Form>
    )
} 
