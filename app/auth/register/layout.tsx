import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rejestracja | PPP",
    description: "Zaloguj się do swojego konta PPP.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}