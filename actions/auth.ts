'use server';
import { env } from '@/config/envConfig';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const signin = async (email: string, password: string) => {
    try {
        const correctEmail = env.ADMIN_EMAIL;
        const correctPassword = env.ADMIN_PASSWORD;

        if (email != correctEmail) throw new Error('Invalid email');
        if (password != correctPassword) throw new Error('Invalid password');

        const token = jwt.sign({ email, password }, env.JWT_SECRET!, {
            expiresIn: Number(env.JWT_EXPIRY!),
        });

        const cookieStore = await cookies();
        cookieStore.set('accessToken', token);
        return { success: true, message: 'Signed in successfully!' };
    } catch (e: any) {
        console.error(e);
        return { success: false, message: e.message };
    }
};

export const signout = async () => {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('accessToken');
        return { success: true, message: 'Signed out successfully!' };
    } catch (e: any) {
        console.error(e);
        return { success: false, message: e.message };
    }
};
