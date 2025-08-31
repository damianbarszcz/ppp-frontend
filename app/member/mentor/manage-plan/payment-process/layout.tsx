import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Konto PPP | Przetwarzanie płatności",
    description: "Twoje konto PPP do zarządzania swoim profilem.",
};

export default function SuccessPaymentLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}