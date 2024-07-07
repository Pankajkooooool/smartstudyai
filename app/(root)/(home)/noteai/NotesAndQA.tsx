'use client';
import React, { useState, useEffect, FC } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Optional import if not using API route


interface NotesAndQAState {
  notes: string;
  question: string;
  answer: string;
  summary: string;
  isLoading: boolean;
  error: string | null;
}

const genAI = new GoogleGenerativeAI('AIzaSyCLzEs_M9MtMWzvHYtwq2Rpg0I2YA5Q3FY');

async function runChat(notes: String,question: String) {
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Retrieve the most relevant and concise answer to the user's question,avoid adding any creative text formats. Here are the Content on which you'll base your answers:\n${notes}\nQuestion: ${question}`;


  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  console.log(text);
  return text;
}

interface NotesAndQAProps {
  extractedText: string;
}

const NotesAndQA: FC<NotesAndQAProps> = (props) => {
  const [notes, setNotes] = useState(
    'This project aims to bridge the gap between image content and interactive chat functionalities. It leverages two key components:',
  );
  const [question, setQuestion] = useState('what is para');
  const [answer, setAnswer] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const ans = await runChat(notes, question);
      setAnswer(ans);
    } catch (error) {
      console.error(error);
      setError('An error occurred while processing your request');
    } finally {
      setIsLoading(false);
    }

    
  };

  useEffect(() => {
    setQuestion(''); // Clear question field after results are displayed
    setNotes(props.extractedText)
  }, [answer, summary, error,props.extractedText]);

  return (
    <>
      <div className="text-white">
  
        <h2>Ask Questions or Request Summary</h2>
        <form  className="" onSubmit={handleSubmit}>
          <textarea className='text-black resize-none w-full bg-slate-200 rounded-lg px-2 py-4'
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            
            placeholder="Enter your question or request a summary"
          />
          <button className='ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary hover:bg-primary/90 h-10 inline-flex items-center justify-center px-6 py-2 border-0 rounded-md text-sm font-medium text-white bg-gradient-to-l from-blue-500 to-purple-600 shadow-lg hover:from-purple-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Submit'}
          </button>
        </form>
        {error && <p className="text-white">{error}</p>}
        {answer && <p className='text-white'>Answer: {answer}</p>}
        {summary && <p className='text-white'>Summary: {summary}</p>}
      </div>
    </>
  );
}

export default NotesAndQA;
