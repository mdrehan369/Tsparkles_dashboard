'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AddProduct from '@/components/products/AddProduct';
import ProductsTable from '@/components/products/ProductsTable';

export default function ProductsPage() {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='text-3xl font-light tracking-tight text-foreground'>Products</h1>
                    <p className='text-sm text-muted-foreground mt-2'>
                        Manage your product catalog
                    </p>
                </div>
                <Button onClick={() => setShowForm(!showForm)} className='gap-2'>
                    <Plus size={16} />
                    Add Product
                </Button>
            </div>

            {showForm && <AddProduct onClose={() => setShowForm(false)} />}

            <Card className='border-sidebar-border'>
                <CardHeader className='border-b border-sidebar-border'>
                    <CardTitle className='text-lg font-light'>All Products</CardTitle>
                </CardHeader>
                <CardContent className='pt-6'>
                    <ProductsTable />
                </CardContent>
            </Card>
        </div>
    );
}
