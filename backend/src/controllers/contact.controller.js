const contactService = require('../services/contact.service');
const sendWhatsApp = require('../utils/sendWhatsApp');

const submitContact = async (req, res, next) => {
  try {
    const contact = await contactService.submitContact(req.body);
    
    // Async WhatsApp Notification
    if (contact.phone) {
      const message = `Hello ${contact.name},\n\nThank you for reaching out to NRK Travels. We have received your inquiry and our team will get back to you shortly.\n\nBest Regards,\nNRK Travels Team`;
      sendWhatsApp(contact.phone, message);
    }

    res.status(201).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

const getContacts = async (req, res, next) => {
  try {
    const { status, page, limit } = req.query;
    const result = await contactService.getContacts({
      status,
      page,
      limit,
    });
    res.status(200).json({
      success: true,
      data: result.contacts,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContact,
  getContacts,
};
