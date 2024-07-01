import { LoginForm } from "@/components/client/ui/AuthenticationForms";
import { Icon, Textual } from "@/components/icons/brand/workio";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LogIn() {
    return (
        <main className="w-full h-full flex justify-between items-center">
            <div className="flex-grow h-full bg-neutral-100  dark:bg-neutral-950  transition-all p-4">
                <div className="flex items-center">
                    <Icon className="fill-black dark:fill-white transition-all h-16 mr-2" />
                    <Textual className="fill-black dark:fill-white transition-all h-8 ml-2" />
                </div>
            </div>
            <div className="relative flex justify-center items-center flex-col w-2/5 h-full bg-neutral-50 dark:bg-neutral-900 border-l border-l-neutral-300 dark:border-l-neutral-600  transition-all">
                <div className="w-fit h-fit top-8 right-8 absolute">
                    <ThemeToggle />
                </div>
                <div className="w-full flex items-center justify-center flex-col">
                    <LoginForm />
                </div>
            </div>
        </main>
    );
}
