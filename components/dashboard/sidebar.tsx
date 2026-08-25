'use client';

import type React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { BarChart3, Package, ShoppingCart, Users, Settings, LogOut, Tag } from 'lucide-react';
import { signout } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <aside className='w-64 bg-sidebar border-r border-sidebar-border h-screen sticky top-0 flex flex-col'>
            <div className='p-6 border-b border-sidebar-border'>
                <h1 className='text-xl font-light tracking-tight text-sidebar-foreground'>Store</h1>
            </div>

            <nav className='flex-1 p-4 space-y-1'>
                <NavItem
                    icon={<BarChart3 size={18} />}
                    label='Dashboard'
                    href='/'
                    active={pathname === '/'}
                />
                <NavItem
                    icon={<Package size={18} />}
                    label='Products'
                    href='/products'
                    active={pathname === '/products'}
                />
                <NavItem
                    icon={<Tag size={18} />}
                    label='Categories'
                    href='/categories'
                    active={pathname === '/categories'}
                />
                <NavItem
                    icon={<ShoppingCart size={18} />}
                    label='Orders'
                    href='/orders'
                    active={pathname === '/orders'}
                />
                <NavItem icon={<Users size={18} />} label='Customers' href='/customers' active={pathname === '/customers'} />
            </nav>

            <div className='border-t border-sidebar-border p-4 space-y-1'>
                <NavItem icon={<Settings size={18} />} label='Settings' href='#' />

                <div
                    onClick={async () => {
                        const { message, success } = await signout();
                        if (success) router.push('/');
                        else toast.error(message);
                    }}
                >
                    <NavItem icon={<LogOut size={18} />} label='Logout' href='#' />
                </div>
            </div>
        </aside>
    );
}

function NavItem({
    icon,
    label,
    href,
    active = false,
}: {
    icon: React.ReactNode;
    label: string;
    href: string;
    active?: boolean;
}) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-colors ${
                active
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
        >
            {icon}
            <span className='font-light'>{label}</span>
        </Link>
    );
}
