import { GoogleGenerativeAI } from '@google/generative-ai';

// const generativeAI = new GoogleGenerativeAI({
//   apiKey: 'AIzaSyCLzEs_M9MtMWzvHYtwq2Rpg0I2YA5Q3FY', // Replace with your actual API key
// });
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMENI_KEY);

export default async function handler(req, res) {
  const { notes, question } = req.body;
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  if (!notes || !question) {
    return res.status(400).json({ error: 'Missing notes or question' });
  }

  try {
      const prompt = `Here are the notes:\n${notes}\nQuestion: ${question}`;
    const result = await model.generateContent(prompt);
  const response =  result.response;
  const text = response.text();
  res.status(200).json(text);



    // const response = await generativeAI.predict({ prompt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process request' });
  }
}
