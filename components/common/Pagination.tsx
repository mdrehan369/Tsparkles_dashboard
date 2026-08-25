import { getPaginationData } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

type PaginationProps = {
    total: number;
    page: number;
    pageSize: number;
    setPage: (val: number) => void;
};

function getPageWindow(current: number, total: number, size: number = 5): number[] {
    const start = Math.max(1, Math.min(current - Math.floor(size / 2), total - size + 1));
    const end = Math.min(total, start + size - 1);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
}

export default function Pagination({ page, total, pageSize, setPage }: PaginationProps) {
    const { totalPages, rangeEnd, rangeStart, currentPage, totalEntries } = getPaginationData(
        total,
        pageSize,
        page
    );
    return (
        <div className='flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-sidebar-border px-6 py-3'>
            <p className='text-xs font-light text-muted-foreground'>
                Showing {rangeStart}–{rangeEnd} of {totalEntries} entr
                {totalEntries === 1 ? 'y' : 'ies'}
            </p>
            {totalPages > 1 && (
                <div className='flex items-center gap-1'>
                    <Button
                        variant='ghost'
                        size='icon'
                        className='size-7 rounded-full cursor-pointer'
                        disabled={currentPage === 1}
                        onClick={() => setPage(currentPage - 1)}
                    >
                        <ChevronLeft size={14} />
                        <span className='sr-only'>Previous page</span>
                    </Button>
                    {getPageWindow(currentPage, totalPages).map((p) => (
                        <Button
                            key={p}
                            variant='ghost'
                            size='icon'
                            onClick={() => setPage(p)}
                            className={`size-7 rounded-full text-xs tabular-nums cursor-pointer ${
                                p === currentPage
                                    ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {p}
                        </Button>
                    ))}
                    <Button
                        variant='ghost'
                        size='icon'
                        className='size-7 rounded-full cursor-pointer'
                        disabled={currentPage === totalPages}
                        onClick={() => setPage(currentPage + 1)}
                    >
                        <ChevronRight size={14} />
                        <span className='sr-only'>Next page</span>
                    </Button>
                </div>
            )}
        </div>
    );
}
