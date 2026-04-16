import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';

export const metadata = {
  title: 'PulseParty',
  description: 'Social Watch Party de próxima generación',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
