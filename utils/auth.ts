import { env } from '@/config/envConfig';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface IJwtPayload extends JwtPayload {
    email: string;
    password: string;
}

export const verifyJwt = (token: string) => {
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET!) as IJwtPayload;
        if (!decoded.email || !decoded.password) throw new Error('Invalid token');

        if (decoded.email != env.ADMIN_EMAIL || decoded.password != env.ADMIN_PASSWORD)
            throw new Error('Invalid credentials');
        return true;
    } catch (e) {
        console.log(e);
        return null;
    }
};
