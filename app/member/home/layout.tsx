import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Konto PPP",
    description: "Twoje konto PPP do zarządzania swoim profilem.",
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}