import React, { useState } from 'react';
import GoogleLogin from '../components/auth/google-login';
import SignUpForm from '../components/auth/register-form';
import SignIn from '../components/auth/login-form';
import styles from './Home.module.css';

const Home: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(true);

  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
  };

  return (
    <div className={styles.homePage}>
      <div className={styles.cardConatiner}>
        <p className={styles.welcome}>Welcome to Expense Tracker</p>
        <div className={styles.cardContains}>

          {isSignUp ? (
            <>
              <SignUpForm />
              <div className={styles.switchText}>
                <p className={styles.texts}>Already have an account?</p>
                <button onClick={toggleForm} className={styles.switchButton}>
                  Sign In
                </button>
              </div>
            </>
          ) : (
            <>
              <SignIn />
              <div className={styles.switchText}>
                <p className={styles.texts}>Don’t have an account?</p>
                <button onClick={toggleForm} className={styles.switchButton}>
                  Sign Up
                </button>
              </div>
            </>
          )}

          <div className={styles.googleLoginSection}>
            <p className={styles.googleText}>Or continue with</p>
            <GoogleLogin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
