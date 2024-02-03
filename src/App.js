import React from 'react';
import { useState } from 'react';
import LoginPage from './LoginPage';
import MainPage from './MainPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Perform the login logic here, and if successful, set isLoggedIn to true
    setIsLoggedIn(true);
  };

  return isLoggedIn ? <MainPage /> : <LoginPage onLogin={handleLogin} />;

  // return (
  //   <div className="App">
  //     <LoginPage />
  //   </div>
  // );
}

export default App;
