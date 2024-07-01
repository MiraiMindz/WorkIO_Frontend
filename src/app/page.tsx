// import Link from "next/link";

import { Link } from "@/components/router/Link";
import { RedirectType, redirect } from "next/navigation";

export default function Home() {

    if (process.env.NEXT_PUBLIC_ENVIRONMENT === "WAILS") {
        redirect("/login.html", RedirectType.replace)
    }
    return (
        <main className="w-full h-full flex justify-center items-center flex-col">
            <h1 className="mb-4">Redirecting to the Login page</h1>
            <Link href="/login">If didn{"'"}t work, please click here to navigate.</Link>
        </main>
    );
}
