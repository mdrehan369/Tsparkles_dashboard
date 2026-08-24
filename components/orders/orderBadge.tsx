import { OrderStatus } from '@/lib/generated/prisma/enums';

const styles: Record<OrderStatus, { badge: string; dot: string }> = {
    PENDING: {
        badge: 'border-border text-muted-foreground',
        dot: 'bg-muted-foreground/40',
    },
    CONFIRMED: {
        badge: 'border-foreground/20 text-foreground',
        dot: 'bg-foreground/60',
    },
    SHIPPED: {
        badge: 'border-foreground/30 bg-foreground/5 text-foreground',
        dot: 'bg-foreground/80',
    },
    DELIVERED: {
        badge: 'border-transparent bg-primary text-primary-foreground',
        dot: 'bg-primary-foreground',
    },
    CANCELLED: {
        badge: 'border-border text-muted-foreground',
        dot: 'border border-muted-foreground/50',
    },
    RETURNED: {
        badge: 'border-border text-muted-foreground',
        dot: 'border border-muted-foreground/50',
    },
};

function OrderBadge({ status }: { status: OrderStatus }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-light tracking-widest uppercase ${styles[status].badge}`}
        >
            <span className={`size-1.5 rounded-full ${styles[status].dot}`} />
            {status}
        </span>
    );
}

export default OrderBadge;
