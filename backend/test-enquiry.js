const axios = require('axios');

async function test() {
  try {
    const response = await axios.post('http://localhost:5000/api/enquiries', {
      name: 'Test User',
      mobile: '9876543210',
      whatsapp: '9876543210',
      pickup: 'Vizag',
      drop: 'Araku',
      tripType: 'One Way'
    });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

test();
