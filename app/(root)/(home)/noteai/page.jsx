"use client"
import React, { useState,useEffect } from 'react';
import NotesAndQA from './NotesAndQA';

const UploadImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [showRunChat, setShowRunChat] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setExtractedText('Please select an image or PDF file');
      return;
    }

    // Check the file type
    const validFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validFileTypes.includes(selectedFile.type)) {
      setExtractedText(`Invalid file type ${selectedFile.type}. Please upload an image file.`);
      return;
    }
    const formData = new FormData();
    formData.append('image', selectedFile);
    try {
      const response = await fetch('http://localhost:3002/api/extract-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // setMessage(`Error: ${response.statusText}`);
        // console.log(response.statusText)
        return;
      }

      const data = await response.json();
      setExtractedText(data.extractedText || 'No text to be extracted');
      setShowRunChat(true);
    } catch (error) {
      console.error(error);
      setShowRunChat(false);
      setExtractedText('');
    }
  };
  useEffect(() => {
    // Handle potential initial state issues by conditionally rendering RunChat
    if (extractedText) {
      setShowRunChat(true);
    }
  }, []);

  return (
    <div>

      <form onSubmit={handleSubmit} className='text-white'>
      <label class="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Pdf or Image File</label>
        <input type="file" className='flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm text-black file:border-0 file:bg-transparent file:text-white file:text-sm file:font-medium' accept="image/*,application/pdf"  onChange={handleFileChange} />
        <button className="text-white bg-blue-500 hover:to-blue-600  p-4 rounded-md" type="submit">Extract Text</button>
      </form>
      <p className='text-white'>{extractedText.slice(0,120)}. . .</p>
      {showRunChat && <NotesAndQA extractedText={extractedText} />}
    </div>
  );
};

export default UploadImage;
