import { NextRequest, NextResponse } from "next/server";
import { generateAdminToken } from "@/lib/auth-utils";

// Simple authentication - now uses proper JWT tokens
export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        if (!password) {
            return NextResponse.json(
                { success: false, error: "Password is required" },
                { status: 400 }
            );
        }

        // Check against environment variable - MUST be set in .env.local
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            console.error("ADMIN_PASSWORD environment variable is not set");
            return NextResponse.json(
                { success: false, error: "Server configuration error" },
                { status: 500 }
            );
        }

        if (password === adminPassword) {
            // Generate proper JWT token with expiration
            const token = generateAdminToken({
                role: 'admin',
                timestamp: Date.now()
            });

            return NextResponse.json({
                success: true,
                token,
            });
        }

        return NextResponse.json(
            { success: false, error: "Invalid password" },
            { status: 401 }
        );
    } catch (error) {
        console.error("Admin auth error:", error);
        return NextResponse.json(
            { success: false, error: "Authentication failed" },
            { status: 500 }
        );
    }
}
