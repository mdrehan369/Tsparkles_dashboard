import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FieldErrors } from 'react-hook-form';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getFlatErrorMessages(errors: FieldErrors): string[] {
    const messages: string[] = [];

    const extract = (obj: any) => {
        if (!obj || typeof obj !== 'object') return;

        if (typeof obj.message === 'string') {
            messages.push(obj.message);
            return;
        }

        for (const key of Object.keys(obj)) {
            extract(obj[key]);
        }
    };

    extract(errors);
    return messages;
}

export const getPaginationData = (total: number, pageSize: number, page: number) => {
    const totalEntries = total;
    const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize));
    const currentPage = Math.min(page, totalPages);
    const rangeStart = totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const rangeEnd = Math.min(currentPage * pageSize, totalEntries);

    return {
        totalEntries,
        currentPage,
        rangeStart,
        rangeEnd,
        totalPages,
    };
};
