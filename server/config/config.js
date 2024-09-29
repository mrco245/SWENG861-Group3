import crypto from 'crypto'

const secret = crypto.randomBytes(32).toString('hex');

export const config = {
    MONGODB_URI : 'mongodb+srv://admin:admin@cluster0.nt77z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    JWT_SECRET: String(secret)
}