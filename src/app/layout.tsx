import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "~/styles/globals.css";

import { TRPCReactProvider } from "../components/providers";

const fontSans = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "Pokemmo breed planner",
    description: "A tool to help you plan your pokemon breeding",
};

export default function Layout(props: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={["font-sans", fontSans.variable].join(" ")}>
                <TRPCReactProvider>{props.children}</TRPCReactProvider>
            </body>
        </html>
    );
}
