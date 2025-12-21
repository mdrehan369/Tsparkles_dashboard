import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string(),
});

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
};
