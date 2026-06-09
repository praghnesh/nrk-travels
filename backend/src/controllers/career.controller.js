const careerService = require('../services/career.service');
const sendWhatsApp = require('../utils/sendWhatsApp');

const submitApplication = async (req, res, next) => {
  try {
    const application = await careerService.submitApplication(req.body);

    // Async WhatsApp Notification
    if (application.phone) {
      const message = `Hello ${application.name},\n\nThank you for applying for the ${application.position || 'position'} at NRK Travels. We have received your application and our HR team will review it shortly.\n\nBest Regards,\nNRK Travels HR Team`;
      sendWhatsApp(application.phone, message);
    }

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

const getApplications = async (req, res, next) => {
  try {
    const { position, page, limit } = req.query;
    const result = await careerService.getApplications({
      position,
      page,
      limit,
    });
    res.status(200).json({
      success: true,
      data: result.applications,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitApplication,
  getApplications,
};
