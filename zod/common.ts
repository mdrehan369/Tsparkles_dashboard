import { AssetType } from '@/lib/generated/prisma/enums';
import z from 'zod';

export const ImageSchema = z.object({
    url: z.string().url(),
    fileId: z.string().min(1, 'File ID is required!'),
    type: z.nativeEnum(AssetType),
});

export type ImageSchemaType = z.infer<typeof ImageSchema>;
