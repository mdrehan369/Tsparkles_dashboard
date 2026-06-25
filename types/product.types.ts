import { Prisma } from '@/lib/generated/prisma/client';
import { AssetType } from '@/lib/generated/prisma/enums';

export type UploadFile = {
    type: AssetType;
    fileId: string;
    url: string;
};

export type AddProductParams = {
    title: string;
    details: string;
    price: number;
    comparePrice: number;
    files: UploadFile[];
    categoryId: number;
    subCategoryId: number;
};

export type ProductWithAssets = Prisma.ProductGetPayload<{
    include: {
        assets: true;
    };
}>;

export type FullProduct = Prisma.ProductGetPayload<{
    include: {
        assets: true;
        category: true;
        subCategory: true;
    };
}>;
