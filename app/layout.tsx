import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SMB Fitness | Strong Mind. Strong Body. Strong You.',
  description: 'Personal fitness coaching, custom programs, nutrition support, and a community built around your soul, mind, and body.',
  metadataBase: new URL('https://smb-fitness-prospect.openai.site'),
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'SMB Fitness | Strong Mind. Strong Body. Strong You.',
    description: 'A premium fitness experience built around expert guidance, personal attention, and a supportive community.',
    images: ['/og.jpg'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/scrollcraft.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
