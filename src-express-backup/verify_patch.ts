

import { prisma } from './utils/prisma';

const API_URL = 'http://localhost:5000/api/v1';

// Temporary token generation function (mocking or implementing basic jwt sign if needed, 
// but since I don't have the secret easily accessible without reading env...
// Actually, I can read env in the script since I'm running with tsx which loads .env)
import jwt from 'jsonwebtoken';

async function verify() {
    try {
        console.log("1. Getting a user from DB...");
        const user = await prisma.user.findFirst();

        if (!user) {
            console.error("No users found in DB. Cannot test.");
            process.exit(1);
        }

        console.log(`Found user: ${user.username} (${user.id})`);

        // Generate a token for the user
        const secret = process.env.ACCESS_SECRET || "access_secret_key";
        const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });

        const newBio = `Updated bio at ${new Date().toISOString()}`;

        console.log(`\n2. Testing PATCH /profile/${user.id} with new bio: "${newBio}"...`);

        const res = await fetch(`${API_URL}/profile/${user.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ bio: newBio })
        });

        if (res.status === 200) {
            const data = await res.json();
            if (data.bio === newBio) {
                console.log("✅ Success: Bio updated via PATCH /profile/:userId");
            } else {
                console.log("❌ Failed: Bio not updated in response.", data);
            }
        } else {
            const err = await res.text();
            console.log(`❌ Failed: Status ${res.status}`, err);
        }

        // Verify cache/DB persistence
        const userRefetch = await prisma.user.findUnique({ where: { id: user.id } });
        if (userRefetch?.bio === newBio) {
            console.log("✅ Verified: DB updated.");
        } else {
            console.log("❌ Verified: DB NOT updated.");
        }

    } catch (error) {
        console.error("Verification failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

verify();
