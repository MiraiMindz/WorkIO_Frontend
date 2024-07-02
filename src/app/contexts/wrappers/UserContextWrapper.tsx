"use client";

import { ReactNode } from "react";
import { UserContextProvider } from "@/app/contexts/UserContext";


export function UserContextWrapper({children}: {children: ReactNode}): ReactNode {
    console.log("USER CONTEXT WRAPPER");
    return (
        <UserContextProvider>
            { children }
        </UserContextProvider>
    )
}