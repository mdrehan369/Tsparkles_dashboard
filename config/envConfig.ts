import { z } from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    NEXT_PUBLIC_API_BASE_URL: z.string().url(),
    NEXT_PUBLIC_APP_NAME: z.string(),
    ADMIN_EMAIL: z.string(),
    ADMIN_PASSWORD: z.string(),
    JWT_SECRET: z.string(),
    JWT_EXPIRY: z.string(),
});

//TODO
const parsedEnv = envSchema.safeParse(process.env);
// console.log(process.env);

// if (!parsedEnv.success) {
//     console.error('❌ Invalid environment variables', parsedEnv.error.flatten().fieldErrors);
//     throw new Error('Invalid environment variables');
// }

// export const env = {
//     DATABASE_URL: parsedEnv.data.DATABASE_URL,
//     API_BASE_URL: parsedEnv.data.NEXT_PUBLIC_API_BASE_URL,
//     APP_NAME: parsedEnv.data.NEXT_PUBLIC_APP_NAME,
// };
//

export const env = {
    DATABASE_URL: process.env.DATABASE_URL,
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_ID: process.env.IMAGEKIT_ID,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
};
