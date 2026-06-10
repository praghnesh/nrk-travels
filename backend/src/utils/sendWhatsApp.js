const axios = require('axios');
const config = require('../config/env');

/**
 * Send a WhatsApp message using Meta Graph API (WhatsApp Cloud API)
 * @param {string} to - Recipient phone number
 * @param {string} body - Text message body
 */
const sendWhatsApp = async (to, body) => {
  const { phoneNumberId, accessToken, apiVersion } = config.whatsapp;

  if (!phoneNumberId || !accessToken) {
    console.warn(`[MOCK WHATSAPP CLOUD API] To: ${to} | Body: ${body}`);
    return true; // Mock success if credentials are not configured
  }

  try {
    // Format the phone number: Remove any non-digit characters.
    let formattedTo = to.replace(/\D/g, '');
    
    // Ensure it has country code (assume India 91 if length is 10)
    if (formattedTo.length === 10) {
      formattedTo = `91${formattedTo}`;
    }

    const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;
    
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedTo,
      type: 'text',
      text: {
        preview_url: false,
        body: body
      }
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`WhatsApp Cloud API Sent Successfully to ${formattedTo}. Message ID: ${response.data.messages[0].id}`);
    return true;
  } catch (error) {
    // Log the error but do not fail the parent function/API
    if (error.response) {
      console.error(`WhatsApp Cloud API Error sending to ${to}:`, JSON.stringify(error.response.data));
    } else {
      console.error(`WhatsApp Cloud API Error sending to ${to}:`, error.message);
    }
    return false;
  }
};

module.exports = sendWhatsApp;
