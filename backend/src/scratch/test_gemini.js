const dotenv = require('dotenv');
const path = require('path');
const https = require('https');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ ERROR: GEMINI_API_KEY is not defined in the env.');
  process.exit(1);
}

console.log('📡 Testing live content generation using models/gemini-2.0-flash...');

const payload = {
  contents: [{
    parts: [{
      text: "Explain what makes a football match exciting in exactly 15 words."
    }]
  }]
};

const options = {
  hostname: 'generativelanguage.googleapis.com',
  path: `/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log(`📥 Response Status: ${res.statusCode}`);
      if (res.statusCode === 200) {
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        console.log('✅ LIVE GEMINI RESPONSE SUCCESSFUL!');
        console.log(`🤖 Output: "${text}"`);
      } else {
        console.error('❌ API Error Response:', JSON.stringify(json, null, 2));
      }
    } catch (err) {
      console.error('❌ JSON Parse Error:', err.message);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Connection Error:', err.message);
});

req.write(JSON.stringify(payload));
req.end();
