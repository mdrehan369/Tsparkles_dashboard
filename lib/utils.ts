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
