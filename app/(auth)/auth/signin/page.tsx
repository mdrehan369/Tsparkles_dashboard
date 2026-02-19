'use client';

import { useState } from 'react';
import { Loader2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signin } from '@/actions/auth';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { success, message } = await signin(form.email, form.password);
            if (success) router.push('/');
            else setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-[80vh] flex items-center justify-center px-4'>
            <div className='w-full max-w-md space-y-6'>
                {/* Heading */}
                <div className='text-center space-y-2'>
                    <h1 className='text-3xl font-light tracking-tight text-foreground'>
                        Welcome back
                    </h1>
                    <p className='text-sm text-muted-foreground'>Sign in to manage your products</p>
                </div>

                {/* Card */}
                <Card className='border-sidebar-border'>
                    <CardHeader className='border-b border-sidebar-border'>
                        <CardTitle className='text-lg font-light'>Sign In</CardTitle>
                    </CardHeader>

                    <CardContent className='pt-6'>
                        <form onSubmit={handleSubmit} className='space-y-5'>
                            {/* Email */}
                            <div className='space-y-2'>
                                <Label className='font-light'>Email</Label>
                                <Input
                                    name='email'
                                    type='email'
                                    placeholder='you@example.com'
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className='space-y-2'>
                                <Label className='font-light'>Password</Label>
                                <Input
                                    name='password'
                                    type='password'
                                    placeholder='••••••••'
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Submit */}
                            <Button type='submit' className='w-full gap-2' disabled={loading}>
                                {loading ? (
                                    <Loader2 size={16} className='animate-spin' />
                                ) : (
                                    <LogIn size={16} />
                                )}
                                Sign In
                            </Button>
                        </form>
                        {error && (
                            <p className='text-red-600 text-sm text-center my-3 py-2 bg-red-100 rounded-sm border-dotted'>
                                {error}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
