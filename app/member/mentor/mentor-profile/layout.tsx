import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Konto PPP | Profil mentora",
    description: "Twoje konto PPP do zarządzania swoim profilem.",
};

export default function MentorProfileLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}