// LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css'; // Import your custom CSS file for styling

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [newUserCheck, setnewUserCheck] = useState(true);
    const [name, setName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [description, setdescription] = useState('');
    const [revenue, setrevenue] = useState('');
    const [userType, setUserType] = useState(''); // 'founder', 'investor', or any default value
    const [showOtpOption, setShowOtpOption] = useState(false);
    const [showUserDetailsInput, setShowUserDetailsInput] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState([]);
    const [temp, setTemp] = useState([]);
    const [loginSuccessful, setLoginSuccessful] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleEmailSubmit = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);
          // Check if the user is already registered, if not, show registration form
            const url = "http://localhost:5000/isRegistered/" + email;

            try {
                const response = await axios.get(url);
                const isRegistered = response.data;

                console.log("Server response:", response.data);
                console.log("Type of isRegistered:", typeof isRegistered);
                
                if (isRegistered.isRegistered) {
                  // If the user is registered, do the following
                  console.log("User is registered.");
                  setnewUserCheck(false);
                } else {
                  // If the user is not registered, do the following
                  console.log("User is NOT registered.");
                  setShowUserDetailsInput(true);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching user registration status:", error);
                setLoading(false);
            }

        } catch (error) {
            setLoading(false);
            console.error('Error registering:', error);
        }
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Send request to backend for login
            const response = await axios.post('http://localhost:5000/login', { email, password });
            const authToken = response.data["access_token"];
            // const authToken = response.data["access_token"];
            localStorage.setItem('authToken', authToken);

            console.log(authToken);
            if (authToken === undefined) {
                setLoading(false);
                setLoginSuccessful(true);
            } else {
                localStorage.setItem("authToken", authToken);
                setLoading(false);
                onLogin();
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setLoading(false);
        }
    };

    const handleDetailsSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send request to backend to save user information
            await axios.post('http://localhost:5000/register', {
                email,
                password,
                name,
                companyName,
                revenue,
                description,
                userType,
            });
            setnewUserCheck(false);
            setShowOtpOption(false);
            setShowUserDetailsInput(false);
        } catch (error) {
            console.error('Error Adding User Details:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <div className="login-heading">
                    <h2>{newUserCheck ? 'Register' : 'Login'}</h2>
                </div>
                {newUserCheck ? (
                    <form onSubmit={handleEmailSubmit}>
                        <div className="form-group">
                            <label>Enter Email:</label>
                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Create a Password:</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
         
                        <div className="form-group">
                            <button type="submit">Register</button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleLoginSubmit}>
                        <div className="form-group">
                            <label>Enter Email:</label>
                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Enter Password:</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <button type="submit">Login</button>
                        </div>
                    </form>
                )}

                {/* Show additional details input for founders or investors */}
                {showUserDetailsInput && (
                    <div>
                     <label>Select User Type:</label>
                     <select value={userType} onChange={(e) => setUserType(e.target.value)}>
                         <option value="">Select</option>
                         <option value="founder">Founder</option>
                         <option value="investor">Investor</option>
                     </select>
         
                     {userType === 'founder' && (
                         <form onSubmit={handleDetailsSubmit}>
                             <div>
                                 <div className="form-group">
                                     <label>Company Name:</label>
                                     <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                                 </div>
                                 <div className="form-group">
                                     <label>Business Description:</label>
                                     <textarea value={description} onChange={(e) => setdescription(e.target.value)} />
                                 </div>
                                 <div className="form-group">
                                     <label>Revenue:</label>
                                     <input type="text" value={revenue} onChange={(e) => setrevenue(e.target.value)} />
                                 </div>
                             </div>
         
                             <div className="form-group">
                                 <button type="submit">Submit Details</button>
                             </div>
                         </form>
                     )}
         
                     {userType === 'investor' && (
                         <form onSubmit={handleDetailsSubmit}>
                             <div className="form-group">
                                 <label>Name:</label>
                                 <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                             </div>
         
                             <div className="form-group">
                                 <button type="submit">Submit Details</button>
                             </div>
                         </form>
                     )}
                 </div>                
                 )}

                {loading && <div className="loading-message">Processing...</div>}

                {loginSuccessful && (
                    <div className="login-error">
                        Email or Password Incorrect
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
