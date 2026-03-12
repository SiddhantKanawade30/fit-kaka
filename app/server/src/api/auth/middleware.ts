
import jwt from "jsonwebtoken"  
import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
import { Router } from "express";

const router = Router();


export const userMiddleware = async(req: Request, res: Response, next: NextFunction) => {

const token = req.headers.token;

console.log('Middleware: Received token:', token);

if(!token){
    console.log('Middleware: No token provided');
    return res.status(401).json({
        message: "Access denied. No token provided."
    })
}


try{
    const decodedToken = jwt.verify(token as string, process.env.JWT_TOKEN || 'fallback-secret-key')
    console.log('Middleware: Decoded token:', decodedToken);

    req.phone = (decodedToken as any).phone;
    console.log('Middleware: Set req.phone to:', req.phone);
    next()
}catch(e){
    console.error('Middleware: JWT verification error:', e);
    return res.status(401).json({
        message: "Invalid token",
        error: (e as any).message
    })
}
}

export default router;