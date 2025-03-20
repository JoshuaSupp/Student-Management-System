const { google } = require("googleapis");
require("dotenv").config();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// 🔹 Paste the extracted code here
const CODE = "4/0AQSTgQEl9My0xDp_NJIGzj3Wc0sahCgYG9D9d_-pSOmYAvVIeH8n124nsqL6qyKYAVTL_w";

async function getRefreshToken() {
  try {
    const { tokens } = await oauth2Client.getToken(CODE);
    console.log("✅ Refresh Token:", tokens.refresh_token);
  } catch (error) {
    console.error("❌ Error getting refresh token:", error);
  }
}

getRefreshToken();
