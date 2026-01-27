import z, { ZodError } from 'zod';

const zodValidator = <T extends z.ZodTypeAny>(schema: T, data: z.infer<T>) => {
    // try {
    return schema.parse(data) as z.infer<T>;
    // } catch (error: any) {
    //     if (error instanceof ZodError) {
    //         const errorMessage = error.errors
    //             .map((err) => `${err.path.join('.')} - ${err.message}`)
    //             .join('; ');
    //         return errorMessage;
    //     }
    //     throw new Error(error);
    // }
};

export default zodValidator;
