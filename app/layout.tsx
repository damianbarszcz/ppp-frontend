import "./globals.css";
import { AuthProvider } from '@/app/context/AuthContext';
import { SubscriptionProvider } from '@/app/context/SubscriptionContext';
import { Noto_Sans } from 'next/font/google'

const notoSans = Noto_Sans({
    subsets: ['latin'],
    weight: ['300','400', '500', '600', '700'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className={notoSans.className}>
          <AuthProvider>
              <SubscriptionProvider>
                {children}
              </SubscriptionProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
