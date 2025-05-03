import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons'


const handleLogout = () => {
  localStorage.removeItem('jwtToken');
  window.location.href = '/login';
};

const LogoutIcon = () => (
  <button onClick={handleLogout}><FontAwesomeIcon icon={faRightFromBracket} size="2x"></FontAwesomeIcon></button>
);

export default LogoutIcon;
