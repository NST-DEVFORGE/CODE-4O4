/**
 * Authentication Utilities
 * Provides secure password hashing and JWT token management
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

// Configuration
const SALT_ROUNDS = 12; // Higher = more secure but slower
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days
const ADMIN_JWT_EXPIRES_IN = '24h'; // Admin tokens expire in 24 hours

// Types
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export interface AdminJWTPayload {
  role: 'admin' | 'mentor';
  timestamp: number;
}

/**
 * Hash a plaintext password using bcrypt
 * @param password - Plaintext password to hash
 * @returns Promise resolving to hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
}

/**
 * Compare a plaintext password with a hashed password
 * @param password - Plaintext password to check
 * @param hashedPassword - Hashed password to compare against
 * @returns Promise resolving to true if passwords match, false otherwise
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
}

/**
 * Generate a JWT token for user authentication
 * @param payload - User data to encode in token
 * @returns JWT token string
 */
export function generateUserToken(payload: JWTPayload): string {
  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'code404-website',
    });
    return token;
  } catch (error) {
    console.error('Error generating user token:', error);
    throw new Error('Failed to generate authentication token');
  }
}

/**
 * Generate a JWT token for admin authentication
 * @param payload - Admin data to encode in token
 * @returns JWT token string
 */
export function generateAdminToken(payload: AdminJWTPayload): string {
  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: ADMIN_JWT_EXPIRES_IN,
      issuer: 'code404-admin',
    });
    return token;
  } catch (error) {
    console.error('Error generating admin token:', error);
    throw new Error('Failed to generate admin token');
  }
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken<T = JWTPayload | AdminJWTPayload>(
  token: string
): T | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as T;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.warn('Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.warn('Invalid token');
    } else {
      console.error('Error verifying token:', error);
    }
    return null;
  }
}

/**
 * Generate a secure random password
 * @param length - Length of password (default: 12)
 * @returns Random password string
 */
export function generateSecurePassword(length: number = 12): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';

  const allChars = lowercase + uppercase + numbers + symbols;

  // Ensure at least one of each type
  let password = '';
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Sanitize log output to prevent credential exposure
 * @param message - Log message
 * @param sensitiveData - Object containing sensitive data to mask
 * @returns Sanitized log message
 */
export function sanitizeLog(
  message: string,
  sensitiveData?: Record<string, string>
): string {
  let sanitized = message;

  if (sensitiveData) {
    Object.entries(sensitiveData).forEach(([key, value]) => {
      if (value) {
        // Replace sensitive values with masked version
        const masked = value.substring(0, 2) + '*'.repeat(value.length - 2);
        sanitized = sanitized.replace(new RegExp(value, 'g'), masked);
      }
    });
  }

  return sanitized;
}

/**
 * Verify admin authentication from request
 * @param request - Next.js request object
 * @returns Admin verification result
 */
export async function verifyAdminAuth(request: NextRequest): Promise<{
  isAdmin: boolean;
  user?: any;
  error?: string;
}> {
  try {
    // Check cookie
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("code404-user");

    if (!userCookie?.value) {
      return { isAdmin: false, error: "Not authenticated" };
    }

    const user = JSON.parse(userCookie.value);

    if (user.role !== "admin") {
      return { isAdmin: false, error: "Not authorized - admin access required" };
    }

    return { isAdmin: true, user };
  } catch (error) {
    console.error("Auth verification error:", error);
    return { isAdmin: false, error: "Authentication failed" };
  }
}
