import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Konto PPP | Ustawienia",
    description: "Twoje konto PPP do zarządzania swoim profilem.",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}