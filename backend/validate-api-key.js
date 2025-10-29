const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.HUGGINGFACE_API_KEY;

async function validateApiKey() {
  console.log('🔑 Validating Hugging Face API Key...\n');
  console.log('API Key Format:', API_KEY ? `${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 5)}` : 'NOT SET');
  console.log('API Key Length:', API_KEY ? API_KEY.length : 0);
  console.log('');

  if (!API_KEY || API_KEY === 'hf_placeholder' || API_KEY === 'your_huggingface_api_key_here') {
    console.log('❌ API key is not set properly in .env file');
    console.log('\nPlease set a valid Hugging Face API key in backend/.env:');
    console.log('HUGGINGFACE_API_KEY=hf_your_actual_token_here');
    console.log('\nGet one free at: https://huggingface.co/settings/tokens');
    return;
  }

  try {
    // Test with a simple, always-available model
    console.log('Testing API key with gpt2 model...\n');
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/gpt2',
      { 
        inputs: 'The quick brown fox',
        options: { wait_for_model: true }
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    console.log('✅ API Key is VALID!');
    console.log('Response received:', typeof response.data);
    console.log('Model is working correctly.');
  } catch (error) {
    console.log('❌ API Key validation failed\n');
    console.log('Status:', error.response?.status);
    console.log('Error:', error.response?.data?.error || error.message);
    console.log('\nPossible issues:');
    console.log('1. Invalid API key format');
    console.log('2. API key has been revoked');
    console.log('3. Network/firewall blocking Hugging Face');
    console.log('4. API key permissions insufficient');
    console.log('\nPlease visit https://huggingface.co/settings/tokens to check your key.');
  }
}

validateApiKey();
