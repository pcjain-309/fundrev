// StartupCard.js

import React, { useState } from 'react';
import axios from 'axios';

const StartupCard = ({ startupId, companyName, businessDescription }) => {
  const [isInterested, setIsInterested] = useState(false);

  const handleInterestToggle = async () => {
    try {
      // Send interest information to the backend
      if (isInterested) {
        await axios.delete(`http://your-backend-url/remove-interest/${startupId}`);
      } else {
        await axios.post(`http://your-backend-url/show-interest/${startupId}`);
      }

      // Toggle the interest state
      setIsInterested(!isInterested);
    } catch (error) {
      // Handle errors, e.g., show an error message
    }
  };

  return (
    <div>
      <h2>{companyName}</h2>
      <p>{businessDescription}</p>

      <button onClick={handleInterestToggle}>
        {isInterested ? 'Remove Interest' : 'Interested'}
      </button>
    </div>
  );
};

export default StartupCard;
