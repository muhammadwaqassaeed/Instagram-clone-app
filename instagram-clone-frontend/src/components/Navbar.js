import React, { useContext, useState } from 'react';
import instalogo from '../Image/instalogo.png';
import '../css/Navbar.css';
import { Link } from 'react-router-dom';
import { LoginContext } from '../context/LoginContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { setModalOpen } = useContext(LoginContext);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Show the custom confirmation popup
    setShowConfirmation(true);
  };

  const handleConfirmLogout = () => {
    // Add any additional logout logic here
    console.log('Logout confirmed');

    // Close the confirmation popup
    setShowConfirmation(false);

    // Open the modal or perform any other actions
    setModalOpen(true);
  };

  const handleCancelLogout = () => {
    // Close the confirmation popup
    setShowConfirmation(false);
  };

  const loginStatus = () => {
    const token = localStorage.getItem('jwt');
    if (token) {
      return (
        <>
          <Link to="/profile"><li>Profile</li></Link>
          <Link to="/createpost"><li>Create Post</li></Link>
          <Link to="/followingpost"><li>My Following</li></Link>

          <button className='primaryBtn' onClick={handleLogout}>Log Out</button>
        </>
      );
    } else {
      return (
        <>
          <Link to="/signup"><li>Sign Up</li></Link>
          <Link to="/signin"><li>Sign In</li></Link>
        </>
      );
    }
  };

  return (
    <div className="navbar">
      <img src={instalogo} alt='' onClick={()=>{navigate("/")}} />
      <ul className="nav-menu">
        {loginStatus()}
      </ul>

      {showConfirmation && (
      <>
        <div className="confirmation-popup active">
          <p>Are you sure you want to log out?</p>
          <button onClick={()=>{
            setShowConfirmation(false);
            localStorage.clear()
            navigate("./signin")
          }}>OK</button>
          <button onClick={handleCancelLogout}>Cancel</button>
        </div>
        <div className="confirmation-overlay"></div>
      </>
    )}
    </div>
  );
}
