import { GoogleGenerativeAI } from '@google/generative-ai';

const generativeAI = new GoogleGenerativeAI({
  apiKey: '', // Replace with your actual API key
});

export default async function handler(req, res) {
  const { notes, question } = req.body;

  if (!notes || !question) {
    return res.status(400).json({ error: 'Missing notes or question' });
  }

  try {
    const prompt = `Here are the notes:\n${notes}\nQuestion: ${question}`;
    const response = await generativeAI.predict({ prompt });
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}
