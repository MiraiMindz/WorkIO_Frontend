import { HTMLAttributes, ReactNode } from "react";
import * as NLink from "next/link";

interface LinkProps extends HTMLAttributes<HTMLAnchorElement> {
    href: string,
    children: ReactNode,
}

export function Link(props: LinkProps) {
    const { href, children, ...restProps } = props; 
    var route: string;
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === "WAILS") {
        route = `${href}.html`;
    } else {
        route = href;
    }
    
    return <NLink.default href={route} prefetch {...restProps}>{children}</NLink.default>
}