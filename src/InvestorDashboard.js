// InvestorDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InvestorDashboard.css';

const InvestorDashboard = ({ authToken }) => {
  const [startups, setStartups] = useState([]);

  useEffect(() => {
    const fetchStartups = async () => {
      const authToken = localStorage.getItem('authToken');
      try {
        const response = await axios.get('http://localhost:5000/allStartups', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        
        // Fetch interest status for each startup
        const startupsWithInterest = await Promise.all(response.data.startups.map(async (startup) => {
          const interestResponse = await axios.get(`http://localhost:5000/check-interest/${startup.id}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          return {
            ...startup,
            isInterested: interestResponse.data.isInterested,
          };
        }));

        setStartups(startupsWithInterest);
      } catch (error) {
        console.error('Error fetching startups:', error.response.data.error);
      }
    };

    fetchStartups();
  }, [authToken]);

  const handleInterestToggle = async (startupId, isInterested) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = isInterested
        ? await axios.delete(`http://localhost:5000/removeInterest/${startupId}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          })
        : await axios.post(`http://localhost:5000/showInterest/${startupId}`, {}, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

      setStartups((prevStartups) =>
        prevStartups.map((startup) =>
          startup.id === startupId
            ? { ...startup, isInterested: !isInterested }
            : startup
        )
      );
    } catch (error) {
      console.error('Error toggling interest:', error.response.data.error);
    }
  };

  return (
    <div className="investor-dashboard">
      <h1>Investor Page</h1>
      <h2>List of Startups</h2>
      <ul>
        {startups.map((startup) => (
          <li key={startup.id} className="startup-item">
            <div className="startup-details">
              <strong>{startup.name}</strong> - {startup.businessDescription}
            </div>
            <button
              className="toggle-interest-btn"
              onClick={() => handleInterestToggle(startup.id, startup.isInterested)}
            >
              {startup.isInterested ? 'Remove Interest' : 'Show Interest'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvestorDashboard;
