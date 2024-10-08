import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../services/firebaseConfig';

export const useAuthRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                navigate('/dashboard', { replace: true });
            }
        });
        return () => unsubscribe();
    }, [navigate]);
};