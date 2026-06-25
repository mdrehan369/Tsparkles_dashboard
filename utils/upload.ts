import { getUploadParams } from '@/actions/assetManagement';
import { AssetType } from '@/lib/generated/prisma/enums';
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from '@imagekit/next';

export default async function uploadAsset({ name, file }: { name: string; file: File }) {
    try {
        const abortController = new AbortController();
        const data = await getUploadParams();

        if (data == null) throw new Error('Error in authenticator');

        const { expire, token, signature, publicKey } = data;
        const uploadResponse = await upload({
            expire,
            token,
            signature,
            publicKey: publicKey!,
            file,
            fileName: name, // Optionally set a custom file name
            // Abort signal to allow cancellation of the upload if needed.
            abortSignal: abortController.signal,
        });
        console.log('Upload response:', uploadResponse);
        if (!uploadResponse) return null;
        return {
            url: uploadResponse.url!,
            fileId: uploadResponse.fileId!,
            type: uploadResponse.fileType == 'image' ? AssetType.IMAGE : AssetType.VIDEO,
        };
    } catch (error) {
        // Handle specific error types provided by the ImageKit SDK.
        if (error instanceof ImageKitAbortError) {
            console.error('Upload aborted:', error.reason);
        } else if (error instanceof ImageKitInvalidRequestError) {
            console.error('Invalid request:', error.message);
        } else if (error instanceof ImageKitUploadNetworkError) {
            console.error('Network error:', error.message);
        } else if (error instanceof ImageKitServerError) {
            console.error('Server error:', error.message);
        } else {
            // Handle any other errors that may occur.
            console.error('Upload error:', error);
        }
    }
}
