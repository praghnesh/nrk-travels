const axios = require('axios');
const Vehicle = require('../models/Vehicle.model');
const VehicleTerm = require('../models/VehicleTerm.model');
const config = require('../config/env');

// Environment variables configuration for Resend and Meta Graph API
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'NRK Travels <onboarding@resend.dev>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@nrtravels.com';

const META_WHATSAPP_PHONE_NUMBER_ID = process.env.META_WHATSAPP_PHONE_NUMBER_ID || '';
const META_WHATSAPP_ACCESS_TOKEN = process.env.META_WHATSAPP_ACCESS_TOKEN || '';

if (!RESEND_API_KEY) {
  console.warn('[WARNING] Resend API key is not configured. Email notifications will be mock-logged.');
}
if (!META_WHATSAPP_ACCESS_TOKEN || !META_WHATSAPP_PHONE_NUMBER_ID) {
  console.warn('[WARNING] Meta WhatsApp Cloud API credentials not configured. WhatsApp notifications will be mock-logged.');
}

/**
 * Helper to fetch vehicle terms dynamically from the database
 */
const fetchVehicleTerms = async (booking) => {
  let terms = [
    'Toll gate charges and parking fees should be paid by the customer.',
    'Driver food should be paid/provided by the customer.',
    'Please maintain decorum and keep the vehicle clean during the tour.'
  ];

  try {
    if (booking.booking_type === 'vehicle' && booking.vehicle_id) {
      // 1. Fetch vehicle details
      const vehicle = await Vehicle.findOne({ $or: [{ name: booking.vehicle_id }, { type: booking.vehicle_id }] });

      if (vehicle) {
        // 2. Fetch specific vehicle terms
        const specificTerms = await VehicleTerm.findOne({ vehicle_type: { $regex: vehicle.name, $options: 'i' } });

        if (specificTerms && specificTerms.terms && specificTerms.terms.length > 0) {
          terms = specificTerms.terms;
        } else {
          // 3. Fallback to general vehicle type terms
          const generalTerms = await VehicleTerm.findOne({ vehicle_type: { $regex: vehicle.type, $options: 'i' } });

          if (generalTerms && generalTerms.terms && generalTerms.terms.length > 0) {
            terms = generalTerms.terms;
          }
        }
      }
    } else if (booking.booking_type === 'hire_driver') {
      const driverTerms = await VehicleTerm.findOne({ vehicle_type: 'Honda Amaze' }); // Standard policy for driver hire
      if (driverTerms && driverTerms.terms) {
        terms = driverTerms.terms;
      }
    }
  } catch (error) {
    console.error('Error fetching vehicle terms from database:', error);
  }

  return terms;
};

/**
 * Send email notifications (Customer Confirmation + Admin Alert) via Resend API
 */
const sendConfirmationEmail = async (booking) => {
  const customerEmailAddress = booking.email || booking.customer_email || 'no-email@nrtravels.com';
  const termsList = await fetchVehicleTerms(booking);
  const travelDateStr = booking.travel_date ? new Date(booking.travel_date).toDateString() : new Date().toDateString();
  const amountPaid = parseFloat(booking.amount || booking.total_amount || 0).toLocaleString('en-IN');

  // 1. Generate redBus/AbhiBus style premium HTML Receipt for the Customer
  const customerHtml = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 25px; border-bottom: 2px dashed #e2e8f0; padding-bottom: 20px;">
        <span style="font-size: 24px; font-weight: 900; color: #0284c7; letter-spacing: 1px;">NRK TRAVELS</span>
        <div style="font-size: 11px; color: #64748b; margin-top: 4px; text-transform: uppercase; font-weight: bold; tracking: 2px;">Premium Travel & Rental Services</div>
      </div>
      
      <!-- Confirmation Status Banner -->
      <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: #ffffff; text-align: center; padding: 18px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.2);">
        <span style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; opacity: 0.85; display: block; margin-bottom: 4px;">E-Ticket / Booking Confirmed</span>
        <span style="font-size: 20px; font-weight: 800; display: block; word-break: break-all;">${booking.booking_id}</span>
      </div>

      <p style="font-size: 15px; color: #475569; line-height: 1.5;">Dear <strong>${booking.customer_name}</strong>,</p>
      <p style="font-size: 14px; color: #475569; line-height: 1.5; margin-bottom: 20px;">Your payment of <strong>₹${amountPaid}</strong> was successfully verified and your booking has been processed. Below is your premium digital travel receipt.</p>
      
      <!-- Booking Details Card -->
      <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
        <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 14px; text-transform: uppercase; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Booking Information</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Service Category</td>
            <td style="padding: 8px 0; font-weight: bold; color: #0f172a; text-transform: uppercase; text-align: right;">${booking.booking_type.replace('_', ' ')}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Date of Travel</td>
            <td style="padding: 8px 0; font-weight: bold; color: #0f172a; text-align: right;">${travelDateStr}</td>
          </tr>
          ${booking.pickup_location ? `
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Pickup Location</td>
            <td style="padding: 8px 0; font-weight: bold; color: #0f172a; text-align: right;">${booking.pickup_location}</td>
          </tr>` : ''}
          ${booking.drop_location ? `
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Drop Location</td>
            <td style="padding: 8px 0; font-weight: bold; color: #0f172a; text-align: right;">${booking.drop_location}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Payment Status</td>
            <td style="padding: 8px 0; font-weight: bold; color: #10b981; text-transform: uppercase; text-align: right;">PAID (${booking.payment_status})</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Transaction ID</td>
            <td style="padding: 8px 0; font-weight: bold; color: #0f172a; font-family: monospace; text-align: right;">${booking.payment_id || 'N/A'}</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="padding: 12px 0 0 0; color: #0f172a; font-weight: bold; font-size: 15px;">Amount Paid</td>
            <td style="padding: 12px 0 0 0; font-weight: 900; color: #059669; font-size: 18px; text-align: right;">₹${amountPaid}</td>
          </tr>
        </table>
      </div>

      <!-- Terms & Conditions Card -->
      <div style="background-color: #fffbeb; border: 1px solid #fef3c7; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
        <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 12px; text-transform: uppercase; color: #b45309; border-bottom: 1px solid #fde68a; padding-bottom: 6px;">Terms & Conditions</h3>
        <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #78350f; line-height: 1.6;">
          ${termsList.map(term => `<li style="margin-bottom: 6px;">${term}</li>`).join('')}
        </ul>
      </div>

      <!-- Support & Footer -->
      <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #64748b;">
        <p style="margin-bottom: 6px; font-weight: bold; color: #0f172a;">Need assistance or want to make changes?</p>
        <p style="margin: 0;">Call Support: <a href="tel:+919111989222" style="color: #0284c7; text-decoration: none; font-weight: bold;">+91 91119 89222</a> | Email: <a href="mailto:support@nrtravels.com" style="color: #0284c7; text-decoration: none; font-weight: bold;">support@nrtravels.com</a></p>
        <p style="margin-top: 15px; font-size: 10px; color: #94a3b8;">© 2026 NRK Travels (Visakhapatnam). All rights reserved.</p>
      </div>
    </div>
  `;

  // 2. Generate detailed HTML Alert for the Admin
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f1f5f9; border-radius: 12px; background-color: #fafafa;">
      <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px; margin-top: 0;">🚨 Alert: New Booking Confirmed!</h2>
      <p style="font-size: 14px; color: #334155;">A new booking has been created and payment has been verified successfully.</p>
      
      <div style="background-color: #ffffff; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <h3 style="margin-top: 0; color: #0f172a; font-size: 14px;">Customer Details:</h3>
        <table style="width: 100%; font-size: 13px;">
          <tr><td><strong>Name:</strong></td><td>${booking.customer_name}</td></tr>
          <tr><td><strong>Email:</strong></td><td>${customerEmailAddress}</td></tr>
          <tr><td><strong>Phone:</strong></td><td>${booking.phone || booking.customer_phone}</td></tr>
        </table>
      </div>

      <div style="background-color: #ffffff; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <h3 style="margin-top: 0; color: #0f172a; font-size: 14px;">Booking Details:</h3>
        <table style="width: 100%; font-size: 13px;">
          <tr><td><strong>Booking ID:</strong></td><td><strong style="color: #0284c7;">${booking.booking_id}</strong></td></tr>
          <tr><td><strong>Category:</strong></td><td>${booking.booking_type.toUpperCase()}</td></tr>
          <tr><td><strong>Travel Date:</strong></td><td>${travelDateStr}</td></tr>
          <tr><td><strong>Pickup:</strong></td><td>${booking.pickup_location || 'N/A'}</td></tr>
          <tr><td><strong>Drop:</strong></td><td>${booking.drop_location || 'N/A'}</td></tr>
          <tr><td><strong>Amount Paid:</strong></td><td><strong style="color: #059669;">₹${amountPaid}</strong></td></tr>
        </table>
      </div>

      <div style="background-color: #ffffff; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <h3 style="margin-top: 0; color: #0f172a; font-size: 14px;">Payment Gateway Info:</h3>
        <table style="width: 100%; font-size: 13px;">
          <tr><td><strong>Razorpay Order ID:</strong></td><td>${booking.order_id || 'N/A'}</td></tr>
          <tr><td><strong>Razorpay Payment ID:</strong></td><td>${booking.payment_id || 'N/A'}</td></tr>
        </table>
      </div>
    </div>
  `;

  // Nodemailer configuration
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.port === 465,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });

  // Send Customer Email
  try {
    if (config.smtp.user && config.smtp.pass) {
      await transporter.sendMail({
        from: config.smtp.from,
        to: customerEmailAddress,
        subject: `Booking Confirmed! - NRK Travels (ID: ${booking.booking_id})`,
        html: customerHtml
      });
      console.log(`Nodemailer: Confirmation email successfully sent to customer: ${customerEmailAddress}`);
    } else {
      console.log('[MOCK SMTP CUSTOMER EMAIL] Body:');
      console.log(customerHtml);
    }
  } catch (error) {
    console.error('SMTP error sending customer email:', error.message);
  }

  // Send Admin Email
  try {
    if (config.smtp.user && config.smtp.pass) {
      await transporter.sendMail({
        from: config.smtp.from,
        to: ADMIN_EMAIL,
        subject: `🚨 New Confirmed Booking Alert! (${booking.booking_id})`,
        html: adminHtml
      });
      console.log(`Nodemailer: New booking alert successfully sent to admin: ${ADMIN_EMAIL}`);
    } else {
      console.log('[MOCK SMTP ADMIN EMAIL] Body:');
      console.log(adminHtml);
    }
  } catch (error) {
    console.error('SMTP error sending admin email:', error.message);
  }
};

const sendWhatsApp = require('../utils/sendWhatsApp');

/**
 * Send WhatsApp booking confirmation via Meta Graph API
 */
const sendWhatsAppConfirmation = async (booking) => {
  const termsList = await fetchVehicleTerms(booking);
  const termsString = termsList.slice(0, 3).map((term, index) => `${index + 1}. ${term}`).join('\n');
  const travelDateStr = booking.travel_date ? new Date(booking.travel_date).toDateString() : new Date().toDateString();
  const amountPaid = parseFloat(booking.amount || booking.total_amount || 0).toLocaleString('en-IN');
  const rawPhone = booking.phone || booking.customer_phone || '0000000000';

  const serviceName = booking.booking_type === 'vehicle' ? 'Vehicle Booking' : booking.booking_type === 'hire_driver' ? 'Hire Driver Request' : 'Tour Booking';

  const messageText = `Hello ${booking.customer_name},\n\nYour NRK Travels booking is CONFIRMED!\n\nBooking ID: ${booking.booking_id}\nTravel Date: ${travelDateStr}\nService: ${serviceName}\nAmount Paid: ₹${amountPaid}\n\nTerms & Conditions:\n${termsString}\n\nThank you for choosing NRK Travels!`;

  try {
    // Send to customer via WhatsApp
    await sendWhatsApp(rawPhone, messageText);
    
    // Send to Admin via WhatsApp if configured
    if (config.twilio && config.twilio.adminPhone) {
      const adminText = `🚨 New Booking Alert!\nID: ${booking.booking_id}\nCustomer: ${booking.customer_name}\nPhone: ${rawPhone}\nService: ${serviceName}\nDate: ${travelDateStr}`;
      await sendWhatsApp(config.twilio.adminPhone, adminText);
    }
  } catch (error) {
    console.error('WhatsApp API error:', error.message);
  }
};

module.exports = {
  sendConfirmationEmail,
  sendWhatsAppConfirmation
};
