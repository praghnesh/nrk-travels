const twilio = require('twilio');
const config = require('../../config/env');

let twilioClient;

try {
  if (config.twilio && config.twilio.accountSid && config.twilio.authToken) {
    twilioClient = twilio(config.twilio.accountSid, config.twilio.authToken);
  }
} catch (error) {
  console.error("Twilio initialization failed:", error);
}

/**
 * Send a WhatsApp message using Twilio API
 * @param {string} to - Recipient phone number
 * @param {string} body - Text message body
 */
const sendWhatsApp = async (to, body) => {
  if (!twilioClient || !config.twilio.phoneNumber) {
    console.warn(`[MOCK WhatsApp] To: ${to} | Body:\n${body}`);
    return true; // Mock success if not configured
  }

  try {
    let toFormatted = to.toString().replace(/\D/g, '');
    // Basic formatting: default to India code (+91) if only 10 digits provided
    if (toFormatted.length === 10) {
      toFormatted = `91${toFormatted}`;
    }

    const message = await twilioClient.messages.create({
      body: body,
      // Default Twilio WhatsApp Sandbox number or user configured number
      from: `whatsapp:${config.twilio.phoneNumber}`,
      to: `whatsapp:+${toFormatted}`
    });

    console.log(`WhatsApp Sent Successfully to +${toFormatted} via Twilio: SID ${message.sid}`);
    return true;
  } catch (error) {
    console.error(`Twilio WhatsApp Error sending to ${to}:`, error.message);
    return false; // Don't throw so it doesn't crash the enquiry service
  }
};

module.exports = sendWhatsApp;
