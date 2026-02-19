import type React from 'react';
import Providers from './Provider';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <Providers>{children}</Providers>;
}
