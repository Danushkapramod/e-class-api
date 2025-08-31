import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const { Client, LocalAuth } = pkg;
export const client = new Client({
  authStrategy: new LocalAuth(), 
  puppeteer: { headless: true } 
});

client.on("qr", qr => {
  qrcode.generate(qr, { small: true });
  console.log("📱 Scan this QR code with WhatsApp (first time only)");
});

client.on("ready", () => {
  console.log("✅ WhatsApp is connected!");
});

// Start the client
client.initialize();