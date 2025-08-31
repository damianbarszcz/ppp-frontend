import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Konto PPP | Kontakty",
    description: "Twoje konto PPP do zarządzania swoim profilem.",
};

export default function ContactsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}