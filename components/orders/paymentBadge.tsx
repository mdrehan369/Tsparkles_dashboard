import { PaymentStatus } from '@/lib/generated/prisma/enums';

function PaymentBadge({ status }: { status: PaymentStatus }) {
    const styles: Record<PaymentStatus, string> = {
        PENDING: 'bg-yellow-100 text-yellow-700',
        PAID: 'bg-green-100 text-green-700',
        FAILED: 'bg-red-100 text-red-700',
        REFUNDED: 'bg-purple-100 text-purple-700',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
            {status}
        </span>
    );
}

export default PaymentBadge;
