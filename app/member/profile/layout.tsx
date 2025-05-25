import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Konto PPP | Profil współpracownika",
    description: "Twoje konto PPP do zarządzania swoim profilem.",
};

export default function ColleagueProfileLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}