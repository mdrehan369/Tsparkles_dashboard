'use server';
import { getUploadAuthParams } from '@imagekit/next/server';
import axios from 'axios';

export async function getUploadParams() {
    try {
        const { token, expire, signature } = getUploadAuthParams({
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, // Never expose this on client side
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
            // expire: 30 * 60, // Optional, controls the expiry time of the token in seconds, maximum 1 hour in the future
            // token: "random-token", // Optional, a unique token for request
        });

        return { token, expire, signature, publicKey: process.env.IMAGEKIT_PUBLIC_KEY };
    } catch (e) {
        console.log(e);
        return null;
    }
}

export default async function deleteAsset(fileId: string) {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY!;
    const encoded = Buffer.from(privateKey).toString('base64');

    const options = {
        method: 'DELETE',
        url: `https://api.imagekit.io/v1/files/${fileId}`,
        headers: { Accept: 'application/json', Authorization: `Basic ${encoded}` },
    };

    try {
        const { data } = await axios.request(options);
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}
