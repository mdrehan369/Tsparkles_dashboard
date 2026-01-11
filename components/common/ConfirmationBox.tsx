'use client';

import {
    AlertDialog,
    AlertDialogTitle,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogDescription,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';

type Props = {
    trigger: React.ReactNode;
    title: string;
    description?: string;
    revokeButtonText: string;
    cancelButtonText: string;
    onRevoke: () => void;
    onCancel?: () => void;
};

function ConfirmationBox({
    trigger,
    title,
    description,
    onCancel,
    onRevoke,
    cancelButtonText,
    revokeButtonText,
}: Props) {
    return (
        <AlertDialog>
            <AlertDialogTrigger>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>{description}</AlertDialogDescription>

                <div className='flex items-center justify-end gap-3 mt-4'>
                    <AlertDialogCancel onClick={() => onCancel?.()}>
                        {cancelButtonText}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={() => onRevoke()}>
                        {revokeButtonText}
                    </AlertDialogAction>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default ConfirmationBox;
