import React, { useContext, useState, useEffect } from 'react';
import { Button, Modal, Popover } from 'antd';
import { RxAvatar } from 'react-icons/rx';
import { IoMdLogOut } from 'react-icons/io';
import { auth } from '../services/firebaseConfig';
import { GlobalContext } from '../context/global-state';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import ExpenseTracker from '../components/dashbord/ExpenseTracker';
import "./dashboard.css"
const { confirm } = Modal;

const Dashboard = () => {
  const { state, dispatch } = useContext(GlobalContext);
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: 'SET_USER', payload: { fullName: user.displayName, email: user.email, uid: user.uid } });
      } else {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [dispatch, navigate]);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      dispatch({ type: 'LOGOUT' });
      navigate('/');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  const showConfirm = () => {
    confirm({
      title: 'Do you want to log out?',
      content: 'This will end your current session.',
      okText: 'Log Out',
      cancelText: 'Cancel',
      onOk() {
        handleLogOut();
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  };

  const content = (
    <Button onClick={showConfirm} icon={<IoMdLogOut />}>
      Log Out
    </Button>
  );

  return (
    <>
      <div className='dashboard-wrapper'>
        <div>
          <h2>EXPENSE TRACKER</h2>
        </div>
        <Popover content={content} trigger="click" placement="bottom">
          <div className="avatar-username-wrapper" style={{ cursor: 'pointer' }}>
            <RxAvatar size={24} />
            {state.user?.fullName || state.user?.email || 'User'}
          </div>
        </Popover>
      </div>
      <div>
        <ExpenseTracker toggle={toggle} setToggle={setToggle} />
      </div>
    </>
  );
};

export default Dashboard;