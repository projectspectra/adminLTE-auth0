import crypto from 'crypto';
const salt = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6';

export const hash = (str: string) => {
    return crypto.createHash('sha256').update(salt + str).digest('hex').substring(0, 10);
}