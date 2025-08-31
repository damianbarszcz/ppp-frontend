import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Rejestracja | PPP",
    description: "Tworzenie własnego konta w aplikacji PPP.",
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}