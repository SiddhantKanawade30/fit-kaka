import jwt from 'jsonwebtoken';
import { Router } from 'express';

const router = Router();

export const login = async (phoneNumber: string) => {
    console.log("Login for phone:", phoneNumber);
    
    try {
        // Validate phone number (10 digits)
        if (!phoneNumber || !/^\d{10}$/.test(phoneNumber)) {
            throw new Error('Invalid phone number. Must be 10 digits.');
        }
        
        // Generate JWT token with phone number as payload
        const token = jwt.sign(
            { 
                phone: phoneNumber,
            },
            process.env.JWT_TOKEN || 'fallback-secret-key',
            { expiresIn: '100y' } // 100 years (never expires)
        );

        return {
            success: true,
            token: token
        };

    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Login failed'
        };
    }
};

// POST /login endpoint
router.post('/login', async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        
        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            });
        }

        const result = await login(phoneNumber);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
        
    } catch (error) {
        console.error('Login endpoint error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

export default router;