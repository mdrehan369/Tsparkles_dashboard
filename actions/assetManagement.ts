'use server';
import { env } from '@/config/envConfig';
import { getUploadAuthParams } from '@imagekit/next/server';
import ImageKit from '@imagekit/nodejs';

const client = new ImageKit({
    privateKey: env.IMAGEKIT_PRIVATE_KEY,
});

export async function getUploadParams() {
    try {
        const { token, expire, signature } = getUploadAuthParams({
            privateKey: env.IMAGEKIT_PRIVATE_KEY as string, // Never expose this on client side
            publicKey: env.IMAGEKIT_PUBLIC_KEY as string,
            // expire: 30 * 60, // Optional, controls the expiry time of the token in seconds, maximum 1 hour in the future
            // token: "random-token", // Optional, a unique token for request
        });

        return { token, expire, signature, publicKey: env.IMAGEKIT_PUBLIC_KEY };
    } catch (e) {
        console.log(e);
        return null;
    }
}

export default async function deleteAsset(fileId: string) {
    try {
        await client.files.delete(fileId);
    } catch (error) {
        console.error(error);
        throw new Error('Some error occured while deleting assets');
    }
}
