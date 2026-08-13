import { Prisma, ProductColor } from '@/lib/generated/prisma/client';
import { AssetType, ProductSizeUnit } from '@/lib/generated/prisma/enums';

export type UploadFile = {
    type: AssetType;
    fileId: string;
    url: string;
};

export type ProductVariant = {
    price: number;
    comparePrice: number;
    size: number;
    unit: ProductSizeUnit;
    weight: number;
};

export type Color = {
    label: string;
    color: string;
};

export type AddProductParams = {
    title: string;
    details: string;
    files: UploadFile[];
    categoryId: number;
    subCategoryId: number;
    variants: ProductVariant[];
    colors: Color[];
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
        ProductColor: true;
        ProductVariant: true;
    };
}>;
