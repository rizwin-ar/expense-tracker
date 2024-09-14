
import React, { useState, useContext } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { GlobalContext } from '../../context/global-state';
import { useAuthRedirect } from './redirectAuth';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { dispatch } = useContext(GlobalContext);
  const navigate = useNavigate();
  useAuthRedirect();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      dispatch({
        type: 'SET_USER',
        payload: {
          fullName: user.displayName || '',
          email: user.email || '',
          uid: user.uid,
        },
      });

      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.error('Sign-in error:', err);
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn} className="signin-form">
        <Input
          style={{
            marginBottom: '10px',
            height: '50px',
            fontSize: '18px',
            color: 'black',
          }}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          prefix={<MailOutlined />}
        />
        <Input.Password
          style={{
            marginBottom: '10px',
            height: '50px',
            fontSize: '18px',
            color: 'black',
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          prefix={<LockOutlined />}
        />
        {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
        <Button
          type="primary"
          htmlType="submit"
          block
          style={{
            marginTop: '20px',
            height: '40px',
            fontSize: '18px',
            fontWeight: 'bold',
            background: '#BD0C47',
            borderColor: '#BD0C47',
          }}
        >
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default SignIn;

