'use client';

import DashboardLayout from '@/components/dashboard/layout';
import { env } from '@/config/envConfig';
import toasterConfig from '@/config/toasterConfig';
import { ImageKitProvider } from '@imagekit/next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <ImageKitProvider urlEndpoint={`https://ik.imagekit.io/${env.IMAGEKIT_ID}`}>
                <DashboardLayout>{children}</DashboardLayout>
                <Toaster {...toasterConfig} />
            </ImageKitProvider>
        </QueryClientProvider>
    );
}

export default Providers;
