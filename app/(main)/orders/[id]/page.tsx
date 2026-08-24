import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CreditCard, Mail, MapPin, Phone, ReceiptText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getOrderById } from '@/actions/orders';
import OrderBadge from '@/components/orders/orderBadge';
import PaymentBadge from '@/components/orders/paymentBadge';
import { OrderStatus } from '@/lib/generated/prisma/enums';
import { formatCurrency } from '@/utils/helpers';

const TIMELINE_STEPS: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

interface OrderDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { id } = await params;
    const orderId = Number(id);

    const order = Number.isInteger(orderId) ? await getOrderById(orderId) : undefined;
    if (!order) notFound();

    const payment = [...order.payments].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

    const shipping = order.shippingAddress as Record<string, string | undefined> | null;
    const billing = (order.billingAddress ?? shipping) as Record<string, string | undefined> | null;

    const currentStep = TIMELINE_STEPS.indexOf(order.status);

    return (
        <div className='space-y-6'>
            <Link
                href='/orders'
                className='inline-flex items-center gap-1.5 text-sm font-light text-muted-foreground hover:text-foreground transition-colors'
            >
                <ArrowLeft size={14} />
                Back to Orders
            </Link>

            <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
                <div>
                    <h1 className='text-3xl font-light tracking-tight text-foreground'>
                        #{order.orderNumber}
                    </h1>
                    <p className='text-sm text-muted-foreground mt-2 font-light'>
                        Placed on{' '}
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}{' '}
                        · {itemCount} item{itemCount === 1 ? '' : 's'}
                    </p>
                </div>
                <div className='flex items-center gap-2'>
                    <PaymentBadge status={payment?.paymentStatus ?? 'PENDING'} />
                    <OrderBadge status={order.status} />
                </div>
            </div>

            {!['CANCELLED', 'RETURNED'].includes(order.status) && (
                <Card className='border-sidebar-border py-4'>
                    <CardContent className='px-6'>
                        <ol className='flex items-center'>
                            {TIMELINE_STEPS.map((step, i) => (
                                <li key={step} className='flex items-center flex-1 last:flex-none'>
                                    <div className='flex flex-col items-center gap-1.5'>
                                        <span
                                            className={`size-2.5 rounded-full ${
                                                i <= currentStep
                                                    ? 'bg-primary'
                                                    : 'border border-muted-foreground/40 bg-transparent'
                                            }`}
                                        />
                                        <span
                                            className={`text-[11px] tracking-widest uppercase whitespace-nowrap ${
                                                i <= currentStep
                                                    ? 'text-foreground font-normal'
                                                    : 'text-muted-foreground font-light'
                                            }`}
                                        >
                                            {step}
                                        </span>
                                    </div>
                                    {i < TIMELINE_STEPS.length - 1 && (
                                        <span
                                            className={`flex-1 h-px mx-3 mb-5 ${
                                                i < currentStep ? 'bg-primary' : 'bg-border'
                                            }`}
                                        />
                                    )}
                                </li>
                            ))}
                        </ol>
                    </CardContent>
                </Card>
            )}

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                <Card className='lg:col-span-2 border-sidebar-border self-start'>
                    <CardHeader className='border-b border-sidebar-border'>
                        <CardTitle className='text-lg font-light'>Items</CardTitle>
                        <CardDescription className='font-light'>
                            {order.items.length} line item{order.items.length === 1 ? '' : 's'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='p-0'>
                        <Table>
                            <TableHeader>
                                <TableRow className='hover:bg-transparent border-sidebar-border'>
                                    <TableHead className='pl-6 font-light'>Product</TableHead>
                                    <TableHead className='font-light'>Size</TableHead>
                                    <TableHead className='font-light'>Qty</TableHead>
                                    <TableHead className='font-light text-right'>Price</TableHead>
                                    <TableHead className='pr-6 font-light text-right'>
                                        Total
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items.map((item) => (
                                    <TableRow key={item.id} className='border-sidebar-border'>
                                        <TableCell className='pl-6 font-light text-foreground'>
                                            {item.title}
                                        </TableCell>
                                        <TableCell className='font-light text-muted-foreground'>
                                            {item.size ?? '—'}
                                        </TableCell>
                                        <TableCell className='font-light text-muted-foreground'>
                                            ×{item.quantity}
                                        </TableCell>
                                        <TableCell className='font-light text-muted-foreground text-right'>
                                            {formatCurrency(item.price)}
                                        </TableCell>
                                        <TableCell className='pr-6 font-normal text-foreground text-right'>
                                            {formatCurrency(item.price * item.quantity)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <div className='space-y-6'>
                    <Card className='border-sidebar-border'>
                        <CardHeader className='border-b border-sidebar-border pb-4'>
                            <CardTitle className='text-lg font-light'>Customer</CardTitle>
                        </CardHeader>
                        <CardContent className='pt-4 space-y-3 text-sm font-light'>
                            <p className='flex items-center gap-2 text-foreground'>
                                <Mail size={14} className='text-muted-foreground' />
                                {order.email}
                            </p>
                            {order.phoneNumber && (
                                <p className='flex items-center gap-2 text-muted-foreground'>
                                    <Phone size={14} />
                                    {order.phoneNumber}
                                </p>
                            )}
                            <Separator className='bg-sidebar-border' />
                            <div className='flex gap-2'>
                                <MapPin size={14} className='mt-0.5 shrink-0 text-muted-foreground' />
                                <div className='text-muted-foreground leading-relaxed'>
                                    {shipping?.fullName && (
                                        <span className='block text-foreground'>
                                            {shipping.fullName}
                                        </span>
                                    )}
                                    {[shipping?.line1, shipping?.line2]
                                        .filter(Boolean)
                                        .join(', ') && (
                                        <span className='block'>
                                            {[shipping?.line1, shipping?.line2]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </span>
                                    )}
                                    <span className='block'>
                                        {[shipping?.city, shipping?.state, shipping?.postalCode]
                                            .filter(Boolean)
                                            .join(', ')}
                                    </span>
                                    <span className='block'>{shipping?.country}</span>
                                </div>
                            </div>
                            {billing && billing !== shipping && (
                                <>
                                    <Separator className='bg-sidebar-border' />
                                    <div className='flex gap-2'>
                                        <ReceiptText
                                            size={14}
                                            className='mt-0.5 shrink-0 text-muted-foreground'
                                        />
                                        <div className='text-muted-foreground leading-relaxed'>
                                            <span className='block text-xs uppercase tracking-widest'>
                                                Billing address
                                            </span>
                                            {[billing.fullName, billing.line1, billing.line2, billing.city, billing.state, billing.postalCode, billing.country]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className='border-sidebar-border'>
                        <CardHeader className='border-b border-sidebar-border pb-4'>
                            <CardTitle className='text-lg font-light'>Payment</CardTitle>
                        </CardHeader>
                        <CardContent className='pt-4 space-y-2.5 text-sm font-light'>
                            <div className='flex justify-between text-muted-foreground'>
                                <span>Subtotal</span>
                                <span className='text-foreground'>
                                    {formatCurrency(subtotal)}
                                </span>
                            </div>
                            {order.totalAmount !== subtotal && (
                                <div className='flex justify-between text-muted-foreground'>
                                    <span>Shipping &amp; charges</span>
                                    <span className='text-foreground'>
                                        {formatCurrency(order.totalAmount - subtotal)}
                                    </span>
                                </div>
                            )}
                            <Separator className='bg-sidebar-border' />
                            <div className='flex justify-between pt-1'>
                                <span className='text-foreground'>Total</span>
                                <span className='font-normal text-foreground'>
                                    {formatCurrency(order.totalAmount)}
                                </span>
                            </div>
                            <Separator className='bg-sidebar-border' />
                            <div className='flex items-center justify-between pt-1 text-muted-foreground'>
                                <span className='flex items-center gap-2'>
                                    <CreditCard size={14} />
                                    {payment?.paymentProvider ?? '—'}
                                </span>
                                {payment?.gateway_payment_id && (
                                    <span className='text-xs truncate max-w-[140px]' title={payment.gateway_payment_id}>
                                        {payment.gateway_payment_id}
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
