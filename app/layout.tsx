import "./globals.css";
import { AuthProvider } from '@/app/context/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
          <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
