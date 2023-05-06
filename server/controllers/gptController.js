const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

exports.generateResponse = async (req, res) => {
  const { prompt} = req.body;

  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'system', content: prompt }],
        max_tokens:200,
        n: 1,
        stop: null,
        temperature: 0.5,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    console.log(response.data.choices[0].message)
    const generatedText = response.data.choices[0].message.content.trim();
    res.json({ text: generatedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};
