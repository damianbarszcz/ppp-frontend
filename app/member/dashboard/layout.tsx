import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Witaj Damian | Konto PPP",
    description: "Twoje konto PPP.",
};

export default function MentorDashboardLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}