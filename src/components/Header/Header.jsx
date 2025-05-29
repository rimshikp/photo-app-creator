import { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {  useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faBars,
  faTimes,
  faUserEdit,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Header.module.css";
import whiteLogo from '../../assets/color-logo-workfoto.png'
export default function Header({ toggleSidebar, isMobile, isSidebarOpen }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useSelector((state) => state.user);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

   const logout = () => {
    localStorage.removeItem('authToken');
    navigate('/sign-in');
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        {isMobile && (
          <button className={styles.menuButton} onClick={toggleSidebar}>
            <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
          </button>
        )}
        <div className={styles.logo}>
          <img src={whiteLogo   } alt="Logo" />
        </div>
      </div>
      <div className={styles.profileSection} ref={dropdownRef}>
        <button className={styles.profileButton} onClick={toggleDropdown}>
          {/* <FontAwesomeIcon icon={faUser} /> */}
          {user.profile ? (
                  <img
                    src={user.profile}
                    alt="Profile"
                    className={styles.profileImage}
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faUserCircle}
                    className={styles.profileIcon}
                  />
                )}
        </button>
        {isDropdownOpen && (
          <div className={styles.dropdown}>
            <a href="/dashboard/edit-profile" className={styles.dropdownItem}>
              <FontAwesomeIcon
                icon={faUserEdit}
                className={styles.dropdownIcon}
              />
              <span>Edit Profile</span>
            </a>
            <a href="" onClick={logout} className={styles.dropdownItem}>
              <FontAwesomeIcon
                icon={faSignOutAlt}
                className={styles.dropdownIcon}
              />
              <span>Logout</span>
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
