import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Konto PPP | Kreator poszukiwań",
    description: "Twoje konto PPP do zarządzania swoim profilem.",
};

export default function SearchCreatorLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}