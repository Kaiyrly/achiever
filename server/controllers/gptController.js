const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/engines/text-curie-001/completions';

exports.generateResponse = async (req, res) => {
  const { prompt, temperature, max_tokens } = req.body;

  try {
    const response = await axios.post(
      API_URL,
      {
        prompt,
        temperature,
        max_tokens,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    res.json(response.data.choices[0].text.trim());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};
