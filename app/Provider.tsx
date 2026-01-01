'use client';

import DashboardLayout from '@/components/dashboard/layout';
import { env } from '@/config/envConfig';
import { ImageKitProvider } from '@imagekit/next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <ImageKitProvider urlEndpoint={`https://ik.imagekit.io/${env.IMAGEKIT_ID}`}>
                <DashboardLayout>{children}</DashboardLayout>
            </ImageKitProvider>
        </QueryClientProvider>
    );
}

export default Providers;
