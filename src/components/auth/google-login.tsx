import React, { useContext } from 'react';
import { Button } from 'antd';
import { FcGoogle } from 'react-icons/fc';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../context/global-state';
import { useAuthRedirect } from './redirectAuth';

const GoogleLogin: React.FC = () => {
  const provider = new GoogleAuthProvider();
  const { dispatch } = useContext(GlobalContext);
  const navigate = useNavigate();
  useAuthRedirect();
  
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      dispatch({
        type: 'SET_USER',
        payload: { fullName: user.displayName || '', email: user.email, uid: user.uid },
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in', error);
    }
  };

  return <Button onClick={handleGoogleLogin} icon={<FcGoogle />}>Sign in with Google</Button>;
};

export default GoogleLogin;
