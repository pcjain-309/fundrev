// StartupDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StartupDashboard.css'; // Import the CSS file
import SalesUpload from './SalesUpload';

const StartupDashboard = ({ userId }) => {
  const [interestedInvestors, setInterestedInvestors] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [salesChart, setSalesChart] = useState(null);

  const fetchInterestedInvestors = async () => {
    const authToken = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`http://localhost:5000/interested-investors/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setInterestedInvestors(response.data.interestedInvestors);
    } catch (error) {
      console.error('Error fetching interested investors:', error.response.data.error);
    }
  };

  const fetchSalesChart = async () => {
    const authToken = localStorage.getItem('authToken');
    try {
      const response = await axios.post(
        `http://localhost:5000/generate-sales-chart`,
        { startDate, endDate },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer', // Important for handling binary response
        }
      );

      // Create a blob from the array buffer and set it as the salesChart state
      const blob = new Blob([response.data], { type: 'image/png' });
      const chartImage = URL.createObjectURL(blob);
      setSalesChart(chartImage);
    } catch (error) {
      console.error('Error fetching sales chart:', error.response.data.error);
    }
  };

  useEffect(() => {
    // Fetch interested investors when the component mounts
    fetchInterestedInvestors();
  }, [userId]);

  const handleRefreshList = () => {
    // Manually trigger the fetch when the "Refresh List" button is clicked
    fetchInterestedInvestors();
  };

  const handleDateChange = (e) => {
    // Update the selected start or end date based on the input name
    const { name, value } = e.target;
    name === 'startDate' ? setStartDate(value) : setEndDate(value);
  };

  const handleFetchChart = () => {
    // Manually trigger the fetch for the sales chart based on the selected date range
    fetchSalesChart();
  };

  return (
    <div className="startup-dashboard">
      <h1>Startup Page</h1>

      <SalesUpload userId={userId} />

      <div className="date-range-container">
        <label htmlFor="startDate">Start Date:</label>
        <input type="date" id="startDate" name="startDate" value={startDate} onChange={handleDateChange} />

        <label htmlFor="endDate">End Date:</label>
        <input type="date" id="endDate" name="endDate" value={endDate} onChange={handleDateChange} />

        <button onClick={handleFetchChart}>Fetch Chart</button>
      </div>

      {salesChart && <img src={salesChart} alt="Sales Chart" />}

      <h2>List of Interested Investors</h2>
      <button className="refresh-list-btn" onClick={handleRefreshList}>
        Refresh List
      </button>
      <ul>
        {interestedInvestors.map((investor) => (
          <li key={investor.id}>{investor.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default StartupDashboard;
