// Script to update Wonton Goreng price in Supabase (no dotenv dependency)
const fs = require('fs');
const path = require('path');

// Parse .env.local manually
const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && vals.length) {
        envVars[key.trim()] = vals.join('=').trim();
    }
});

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function updateWontonPrice() {
    console.log("Updating Wonton Goreng price to 20000...");
    console.log("URL:", SUPABASE_URL);

    const response = await fetch(`${SUPABASE_URL}/rest/v1/products?name=eq.Wonton%20Goreng`, {
        method: 'PATCH',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify({ price: 20000 })
    });

    if (response.ok) {
        const data = await response.json();
        console.log("✅ Wonton Goreng price updated successfully:", data);
    } else {
        const error = await response.text();
        console.error("❌ Failed to update:", response.status, error);
    }
}

updateWontonPrice();
