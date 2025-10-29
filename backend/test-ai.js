/**
 * Quick test script for AI endpoints
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api/ai';

async function testImproveTitle() {
  console.log('\n🧪 Testing AI Improve Title...');
  try {
    const response = await axios.post(`${API_URL}/improve-title`, {
      title: 'how to learn react'
    });
    console.log('✅ Success:', response.data);
  } catch (error) {
    console.error('❌ Error Details:');
    console.error('  Status:', error.response?.status);
    console.error('  Data:', JSON.stringify(error.response?.data, null, 2));
    console.error('  Message:', error.message);
  }
}

async function testGenerateExcerpt() {
  console.log('\n🧪 Testing AI Generate Excerpt...');
  try {
    const response = await axios.post(`${API_URL}/generate-excerpt`, {
      title: 'Learn React in 2024',
      content: '<p>React is a popular JavaScript library for building user interfaces. It was created by Facebook and is now maintained by Meta and a community of developers.</p>'
    });
    console.log('✅ Success:', response.data);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting AI Endpoint Tests...');
  console.log('Make sure the backend server is running on port 5000\n');
  
  await testImproveTitle();
  await testGenerateExcerpt();
  
  console.log('\n✨ Tests completed!');
}

runTests();
