import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Logowanie | PPP",
    description: "Zaloguj się do swojego konta PPP.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}