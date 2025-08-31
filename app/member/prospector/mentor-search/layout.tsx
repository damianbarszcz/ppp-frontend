import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Konto PPP | Znajdowanie mentora",
    description: "Wyszkuwanie mentora",
};

export default function MentorSearchLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}