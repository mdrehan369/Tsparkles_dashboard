'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AddProductFormSchema, AddProductFormType, EditProductFormDataType } from '@/zod/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, FieldErrors, useFieldArray, useForm } from 'react-hook-form';
import FileUpload from './FileUpload';
import { useEffect, useState } from 'react';
import uploadAsset from '@/utils/upload';
import { addProduct, deleteProductAsset, updateProduct } from '@/actions/products';
import { CategoryWithSubCategory } from '@/types/category.types';
import { fetchAllCategories } from '@/queries/category';
import { categoryKeys } from '@/constants/querykeys';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FullProduct } from '@/types/product.types';
import { Image } from '@imagekit/next';
import {
    Trash2,
    Image as ImageIcon,
    Tag,
    DollarSign,
    Layers,
    Palette,
    Ruler,
    Plus,
} from 'lucide-react';
import deleteAsset from '@/actions/assetManagement';
import { getFlatErrorMessages } from '@/lib/utils';

type Props = {
    onClose: () => void;
    isEditing?: boolean;
    editingProductData?: FullProduct;
};

// NOTE: field names below (colors / variants, and their sub-keys) are my best
// guess based on your Prisma models (ProductColor: color, label |
// ProductVariant: sku, size, unit, stock). Rename to match whatever keys you
// actually used in AddProductFormSchema if they differ.
const UNIT_OPTIONS = ['INCH', 'CM', 'M'] as const;

export default function AddProduct({ onClose, isEditing = false, editingProductData }: Props) {
    const { data: categories } = useQuery<CategoryWithSubCategory[]>({
        initialData: [],
        queryKey: categoryKeys.GET_ALL_CATEGORIES,
        queryFn: () => fetchAllCategories(1, 15, ''),
    });
    const [freeze, setFreeze] = useState(false);
    const [deletedFileIds, setDeletedFileIds] = useState<string[]>([]);
    const {
        register,
        handleSubmit,
        watch,
        control,
        reset,
        formState: { isSubmitting, errors },
    } = useForm<AddProductFormType>({
        resolver: zodResolver(AddProductFormSchema),
        defaultValues: async () => {
            if (isEditing && editingProductData) {
                const product: EditProductFormDataType = {
                    description: editingProductData.details || '',
                    title: editingProductData.title,
                    category: editingProductData.category.id,
                    subCategory: editingProductData.subCategory.id,
                    colors:
                        editingProductData.ProductColor.map((c) => ({
                            color: c.color,
                            label: c.label,
                        })) || [],
                    variants:
                        editingProductData.ProductVariant.map((v) => ({
                            size: v.size,
                            unit: v.unit,
                            stock: v.stock,
                            comparePrice: v.comparePrice,
                            price: v.price,
                            weight: v.weight,
                        })) || [],
                };
                return product;
            }
            return {
                title: '',
                category: 0,
                description: '',
                subCategory: 0,
                colors: [],
                variants: [],
            };
        },
    });

    const {
        fields: colorFields,
        append: appendColor,
        remove: removeColor,
    } = useFieldArray({ control, name: 'colors' });

    const {
        fields: variantFields,
        append: appendVariant,
        remove: removeVariant,
    } = useFieldArray({ control, name: 'variants' });

    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        const errorMessages = getFlatErrorMessages(errors);

        errorMessages.forEach((message) => {
            toast.error(message, {
                id: message,
            });
        });
    }, [errors]);

    const submit = async (data: AddProductFormType) => {
        try {
            if (files.length == 0 && (editingProductData?.assets.length || 0) == 0) {
                toast.error('No assets provided');
                return;
            }
            let toastId = toast.loading('Uploading Assets...');
            const uploadFiles = [];
            for (const file of files) {
                const uploadedFile = await uploadAsset({ name: file.name, file });
                if (uploadedFile) uploadFiles.push(uploadedFile);
            }
            if (uploadFiles.length + (editingProductData?.assets.length || 0) == 0 && !isEditing) {
                toast.error('Please upload assets for product');
            }
            const { title, description, category, subCategory, colors, variants } = data;
            toast.dismiss(toastId);
            toastId = toast.loading(!isEditing ? 'Adding Product...' : 'Updating Product...');
            const payload = {
                title,
                details: description,
                categoryId: category,
                subCategoryId: subCategory,
                colors,
                variants,
                files: uploadFiles,
            };
            if (isEditing) await updateProduct(editingProductData!.id, payload);
            else await addProduct(payload);
            toast.dismiss(toastId);
            toast.success(
                !isEditing ? 'Product Added Successfully!' : 'Product Updated Successfully!'
            );
            reset();
            setFiles([]);
            onClose();
        } catch (e) {
            console.log(e);
            toast.dismissAll();
            toast.error('Some error occured');
        }
    };

    const handleDeleteAsset = async (fileId: string) => {
        if (freeze) return;
        try {
            setFreeze(true);
            toast.loading('Deleting asset...');
            await deleteAsset(fileId);
            await deleteProductAsset(editingProductData!.id, fileId);
            setDeletedFileIds((prev) => [...prev, fileId]);
            toast.dismissAll();
            toast.success('Asset deleted successfully');
        } catch (e: any) {
            toast.dismissAll();
            toast.error('Some error occured while deleting');
        } finally {
            setFreeze(false);
        }
    };

    return (
        <Card className='border-sidebar-border h-full flex flex-col justify-between shadow-sm overflow-hidden'>
            {!isEditing && (
                <CardHeader className='border-b border-sidebar-border px-6 py-4 bg-muted/20'>
                    <CardTitle className='text-xl font-medium tracking-tight'>
                        Add New Product
                    </CardTitle>
                </CardHeader>
            )}
            <CardContent className='flex-1 overflow-y-auto p-6 space-y-8'>
                <form id='product-form' onSubmit={handleSubmit(submit)} className='space-y-8'>
                    {/* General Section */}
                    <div className='space-y-4'>
                        <div className='flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider'>
                            <Tag className='w-4 h-4' />
                            <span>General Information</span>
                        </div>
                        <div className='space-y-3'>
                            <div>
                                <label className='text-xs font-medium text-muted-foreground mb-1 block'>
                                    Product Title
                                </label>
                                <Input
                                    placeholder='e.g. Magic Scented Candle'
                                    {...register('title')}
                                    required
                                    disabled={freeze}
                                    className='h-10'
                                />
                            </div>
                            <div>
                                <label className='text-xs font-medium text-muted-foreground mb-1 block'>
                                    Description
                                </label>
                                <Textarea
                                    className='resize-none min-h-[100px]'
                                    placeholder='Provide detailed description of the product...'
                                    {...register('description')}
                                    required
                                    disabled={freeze}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Classification Section */}
                    <div className='space-y-4'>
                        <div className='flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider'>
                            <Layers className='w-4 h-4' />
                            <span>Category & Classification</span>
                        </div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div>
                                <label className='text-xs font-medium text-muted-foreground mb-1 block'>
                                    Category
                                </label>
                                <Controller
                                    control={control}
                                    name='category'
                                    disabled={freeze}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={(val) => field.onChange(Number(val))}
                                            value={field.value?.toString()}
                                            defaultValue={
                                                editingProductData?.categoryId.toString() || '0'
                                            }
                                        >
                                            <SelectTrigger className='w-full h-10'>
                                                <SelectValue placeholder='Select Category' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((cat) => (
                                                    <SelectItem
                                                        key={cat.id}
                                                        value={cat.id.toString()}
                                                    >
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div>
                                <label className='text-xs font-medium text-muted-foreground mb-1 block'>
                                    Sub-Category
                                </label>
                                <Controller
                                    control={control}
                                    name='subCategory'
                                    disabled={freeze}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={(val) => field.onChange(Number(val))}
                                            value={field.value?.toString()}
                                            defaultValue={
                                                editingProductData?.subCategoryId.toString() || '0'
                                            }
                                        >
                                            <SelectTrigger className='w-full h-10'>
                                                <SelectValue placeholder='Select Sub Category' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories
                                                    ?.find(
                                                        (cat) =>
                                                            cat.id === Number(watch('category'))
                                                    )
                                                    ?.subCategory.map((cat) => (
                                                        <SelectItem
                                                            key={cat.id}
                                                            value={cat.id.toString()}
                                                        >
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Colors Section */}
                    <div className='space-y-4'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider'>
                                <Palette className='w-4 h-4' />
                                <span>Colors</span>
                            </div>
                            <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                disabled={freeze}
                                onClick={() => appendColor({ color: '#000000', label: '' })}
                            >
                                <Plus className='w-4 h-4 mr-1' />
                                Add Color
                            </Button>
                        </div>
                        <div className='space-y-2'>
                            {colorFields.length === 0 && (
                                <p className='text-xs text-muted-foreground italic'>
                                    No colors added yet.
                                </p>
                            )}
                            {colorFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className='flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/10'
                                >
                                    <Input
                                        type='color'
                                        {...register(`colors.${index}.color` as const)}
                                        disabled={freeze}
                                        className='h-10 w-14 p-1 cursor-pointer'
                                    />
                                    <Input
                                        placeholder='Label e.g. Midnight Blue'
                                        {...register(`colors.${index}.label` as const)}
                                        disabled={freeze}
                                        className='h-10 flex-1'
                                    />
                                    <Button
                                        type='button'
                                        variant='ghost'
                                        size='icon'
                                        disabled={freeze}
                                        onClick={() => removeColor(index)}
                                        className='text-destructive hover:text-destructive'
                                    >
                                        <Trash2 className='w-4 h-4' />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Variants Section */}
                    <div className='space-y-4'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider'>
                                <Ruler className='w-4 h-4' />
                                <span>Variants</span>
                            </div>
                            <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                disabled={freeze}
                                onClick={() =>
                                    appendVariant({
                                        size: 0,
                                        unit: 'INCH',
                                        stock: 10,
                                        price: 100,
                                        comparePrice: 200,
                                        weight: 100,
                                    })
                                }
                            >
                                <Plus className='w-4 h-4 mr-1' />
                                Add Variant
                            </Button>
                        </div>
                        <div className='space-y-2'>
                            {variantFields.length === 0 && (
                                <p className='text-xs text-muted-foreground italic'>
                                    No variants added yet.
                                </p>
                            )}
                            {variantFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className='grid grid-cols-1 sm:grid-cols-[0.8fr_0.8fr_0.8fr_0.8fr_0.8fr_auto] gap-2 p-3 rounded-lg border border-border bg-muted/10 items-end'
                                >
                                    <div>
                                        <label className='text-[11px] font-medium text-muted-foreground mb-1 block'>
                                            Size
                                        </label>
                                        <Input
                                            type='number'
                                            step='0.01'
                                            placeholder='0'
                                            {...register(`variants.${index}.size` as const, {
                                                valueAsNumber: true,
                                            })}
                                            disabled={freeze}
                                            className='h-10'
                                        />
                                    </div>
                                    <div>
                                        <label className='text-[11px] font-medium text-muted-foreground mb-1 block'>
                                            Weight
                                        </label>
                                        <Input
                                            type='number'
                                            step='1'
                                            placeholder='0'
                                            {...register(`variants.${index}.weight` as const, {
                                                valueAsNumber: true,
                                            })}
                                            disabled={freeze}
                                            className='h-10'
                                        />
                                    </div>
                                    <div>
                                        <label className='text-[11px] font-medium text-muted-foreground mb-1 block'>
                                            Unit
                                        </label>
                                        <Controller
                                            control={control}
                                            name={`variants.${index}.unit` as const}
                                            disabled={freeze}
                                            render={({ field: unitField }) => (
                                                <Select
                                                    onValueChange={unitField.onChange}
                                                    value={unitField.value}
                                                >
                                                    <SelectTrigger className='w-full h-10'>
                                                        <SelectValue placeholder='Unit' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {UNIT_OPTIONS.map((unit) => (
                                                            <SelectItem key={unit} value={unit}>
                                                                {unit}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <label className='text-[11px] font-medium text-muted-foreground mb-1 block'>
                                            Stock
                                        </label>
                                        <Input
                                            type='number'
                                            placeholder='10'
                                            {...register(`variants.${index}.stock` as const, {
                                                valueAsNumber: true,
                                            })}
                                            disabled={freeze}
                                            className='h-10'
                                        />
                                    </div>
                                    <div>
                                        <label className='text-[11px] font-medium text-muted-foreground mb-1 block'>
                                            Price
                                        </label>
                                        <Input
                                            type='number'
                                            placeholder='10'
                                            {...register(`variants.${index}.price` as const, {
                                                valueAsNumber: true,
                                            })}
                                            disabled={freeze}
                                            className='h-10'
                                        />
                                    </div>
                                    <div>
                                        <label className='text-[11px] font-medium text-muted-foreground mb-1 block'>
                                            Compare Price
                                        </label>
                                        <Input
                                            type='number'
                                            placeholder='10'
                                            {...register(
                                                `variants.${index}.comparePrice` as const,
                                                {
                                                    valueAsNumber: true,
                                                }
                                            )}
                                            disabled={freeze}
                                            className='h-10'
                                        />
                                    </div>

                                    <Button
                                        type='button'
                                        variant='ghost'
                                        size='icon'
                                        disabled={freeze}
                                        onClick={() => removeVariant(index)}
                                        className='text-destructive hover:text-destructive h-10'
                                    >
                                        <Trash2 className='w-4 h-4' />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Media Assets Section */}
                    <div className='space-y-4'>
                        <div className='flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider'>
                            <ImageIcon className='w-4 h-4' />
                            <span>Product Assets</span>
                        </div>
                        {isEditing && editingProductData && (
                            <div className='space-y-2'>
                                <label className='text-xs font-medium text-muted-foreground block'>
                                    Existing Media
                                </label>
                                <div className='grid grid-cols-3 sm:grid-cols-4 gap-3 p-3 bg-muted/10 rounded-lg border border-border'>
                                    {editingProductData.assets.map(
                                        (asset) =>
                                            !deletedFileIds.includes(asset.fileId) && (
                                                <div
                                                    className='group relative aspect-square rounded-md overflow-hidden border border-border bg-background'
                                                    key={asset.id}
                                                >
                                                    <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10'>
                                                        <Button
                                                            type='button'
                                                            variant='destructive'
                                                            size='icon'
                                                            onClick={() =>
                                                                handleDeleteAsset(asset.fileId)
                                                            }
                                                            className='h-8 w-8 rounded-full'
                                                        >
                                                            <Trash2 className='h-4 w-4' />
                                                        </Button>
                                                    </div>
                                                    <Image
                                                        src={asset.url}
                                                        alt={editingProductData.title}
                                                        className='object-cover z-0'
                                                        loading='lazy'
                                                        fill
                                                    />
                                                </div>
                                            )
                                    )}
                                </div>
                            </div>
                        )}
                        <div>
                            <label className='text-xs font-medium text-muted-foreground mb-2 block'>
                                Upload New Files
                            </label>
                            <FileUpload files={files} setFiles={setFiles} />
                        </div>
                    </div>
                </form>
            </CardContent>
            {/* Actions Bar */}
            <div className='p-4 border-t border-sidebar-border bg-background flex items-center gap-3'>
                <Button
                    type='submit'
                    form='product-form'
                    className='flex-1'
                    disabled={isSubmitting || freeze}
                >
                    {isEditing ? 'Save Changes' : 'Add Product'}
                </Button>
                <Button
                    type='button'
                    variant='outline'
                    onClick={() => onClose()}
                    className='flex-1'
                    disabled={isSubmitting || freeze}
                >
                    Cancel
                </Button>
            </div>
        </Card>
    );
}
