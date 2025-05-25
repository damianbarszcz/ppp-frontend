import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Konto PPP | Zespoły",
    description: "Twoje konto PPP do zarządzania swoim profilem.",
};

export default function ChannelsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}