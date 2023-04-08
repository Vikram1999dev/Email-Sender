import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [textArea, setTextArea] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3001/send-email', {
        email,
        textArea,
        subject,
      });
      setMessage(response);
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='app'>
      <div className='form'>
        <h1>Email Sender</h1>
        <input
          type='email'
          placeholder='Email'
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type='text'
          placeholder='Subject'
          onChange={(e) => setSubject(e.target.value)}
        />

        <input
          type='text'
          placeholder='Content'
          onChange={(e) => setTextArea(e.target.value)}
        />
        <button onClick={handleSubmit}>Send Email</button>
      </div>

      {message && <h1>Message Send</h1>}
    </div>
  );
}

export default App;
