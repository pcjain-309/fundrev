// MainPage.js
import React, { useState, useEffect } from 'react';
import StartupDashboard from './StartupDashboard';
import InvestorDashboard from './InvestorDashboard';
import axios from 'axios';

const MainPage = () => {
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        
        const authToken = localStorage.getItem('authToken');

        const response = await axios.get('http://localhost:5000/user-info', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        setUserType(response.data.userType);
        setUserId(response.data.userId);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching user info:', error.response.data.error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div>
      {userType === 'founder' && userId ? (
        <StartupDashboard userId={userId} />
      ) : userType === 'investor' && userId ? (
        <InvestorDashboard userId={userId} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default MainPage;
