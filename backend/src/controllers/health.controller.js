const catchAsync = require('../utils/catchAsync');

const checkHealth = catchAsync(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Vizag Taxi Backend Running',
  });
});

module.exports = {
  checkHealth,
};
