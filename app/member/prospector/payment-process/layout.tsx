import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Konto PPP | Subskrybcja mentora",
    description: "Twoje konto PPP do zarządzania swoim profilem.",
};

export default function ManagePlanLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}