import '@/styles/globals.css';
import { Roboto } from 'next/font/google';
import React from 'react';

import { type Metadata } from 'next';
import Providers from './provider';

import { Toaster as SonnerToaster } from '@/components/ui/sonner';

// Roboto font
const roboto = Roboto({
    weight: ['100', '300', '400', '500', '700', '900'],
    subsets: ['latin', 'cyrillic'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Next-Admin-shadcn-ui',
    description: 'A Admin Uses shadcn-ui',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // console.log("session", session);

    return (
        <>
            <html lang='en' suppressHydrationWarning={true} suppressContentEditableWarning={true}>
                <body className={roboto.className} suppressHydrationWarning={true}>
                    <Providers>{children}</Providers>
                    <SonnerToaster />
                </body>
            </html>
        </>
    );
}
