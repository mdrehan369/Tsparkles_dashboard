import { NextRequest, NextResponse } from 'next/server';
import { STATUS_CODES } from '@/constants/status_codes';
import { ZodError } from 'zod';

export default function asyncHandler<TContext = undefined>(
    fn: (req: NextRequest, context: TContext) => Promise<NextResponse>
) {
    return async (req: NextRequest, context: TContext): Promise<NextResponse> => {
        try {
            return await fn(req, context);
        } catch (err: unknown) {
            console.error(err);

            let message = 'Internal Server Error';
            let status = STATUS_CODES.INTERNAL_SERVER_ERROR;

            if (err instanceof ZodError) {
                message = err.issues
                    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
                    .join(' | ');
                status = STATUS_CODES.BAD_REQUEST;
            } else if (err instanceof Error) {
                message = err.message;
            }

            return NextResponse.json(
                {
                    success: false,
                    message,
                    data: null,
                },
                { status }
            );
        }
    };
}
