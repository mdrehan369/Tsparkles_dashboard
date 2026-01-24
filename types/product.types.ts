import { Prisma } from '@/prisma/generated/prisma/client';
import { AssetType } from '@/prisma/generated/prisma/enums';

export type UploadFile = {
    type: AssetType;
    fileId: string;
    url: string;
};

export type AddProductParams = {
    title: string;
    description: string;
    price: number;
    comparePrice: number;
    files: UploadFile[];
    categoryId: number;
    subCategoryId: number;
};

export type ProductWithAssets = Prisma.ProductGetPayload<{
    include: {
        Asset: true;
    };
}>;

export type FullProduct = Prisma.ProductGetPayload<{
    include: {
        Asset: true;
        Category: true;
        SubCategory: true;
    };
}>;
