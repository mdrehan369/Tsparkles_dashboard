import { PaymentStatus } from '@/lib/generated/prisma/enums';

const styles: Record<PaymentStatus, { badge: string; dot: string }> = {
    PENDING: {
        badge: 'border-border text-muted-foreground',
        dot: 'bg-muted-foreground/40',
    },
    PAID: {
        badge: 'border-transparent bg-primary text-primary-foreground',
        dot: 'bg-primary-foreground',
    },
    FAILED: {
        badge: 'border-border text-muted-foreground',
        dot: 'border border-muted-foreground/50',
    },
    REFUNDED: {
        badge: 'border-foreground/20 bg-foreground/5 text-foreground',
        dot: 'bg-foreground/50',
    },
};

function PaymentBadge({ status }: { status: PaymentStatus }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-light tracking-widest uppercase ${styles[status].badge}`}
        >
            <span className={`size-1.5 rounded-full ${styles[status].dot}`} />
            {status}
        </span>
    );
}

export default PaymentBadge;
