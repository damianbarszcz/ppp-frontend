import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Konto PPP | Co nowego dzisiaj tworzymy ?",
    description: "Twoje konto PPP do zarządzania swoim profilem.",
};

export default function PostCreatorLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}