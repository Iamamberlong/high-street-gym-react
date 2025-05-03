import React from 'react';


const handleLogout = () => {
 
  localStorage.removeItem('jwtToken');
  window.location.href = '/login';
};

const LogoutButton = () => (
  <button onClick={handleLogout}>Logout</button>
);

export default LogoutButton;
