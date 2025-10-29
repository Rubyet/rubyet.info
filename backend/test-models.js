const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.HUGGINGFACE_API_KEY;

async function testModels() {
  const models = [
    'gpt2',
    'microsoft/phi-2',
    'meta-llama/Llama-2-7b-hf',
    'mistralai/Mistral-7B-v0.1',
    'google/flan-t5-base'
  ];

  console.log('API Key:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT SET');
  console.log('\nTesting models...\n');

  for (const model of models) {
    try {
      console.log(`Testing: ${model}`);
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${model}`,
        { inputs: 'Hello, how are you?' },
        {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );
      console.log(`✅ ${model} works!`);
      console.log('Response:', JSON.stringify(response.data).substring(0, 100));
    } catch (error) {
      console.log(`❌ ${model} failed: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
    }
    console.log('');
  }
}

testModels();
