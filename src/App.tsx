import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/auth/login-form';
import SignUpForm from './components/auth/register-form';
import Dashboard from './pages/dashbord';
import Home from './pages/homePage';
import { GlobalProvider } from './context/global-state';

function App() {
  return (
    <GlobalProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}

export default App;
