import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faTags,
  faImages,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Sidebar.module.css";
export default function Sidebar({ isOpen, closeSidebar, isMobile }) {
  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.open : ""} ${
        !isMobile ? styles.desktop : ""
      }`}
    >
      <div className={styles.sidebarContent}>
        <div className={styles.logo}>
          <img src="/logo.svg" alt="Logo" />
        </div>
        <nav className={styles.nav}>
          <ul>
            <li>
              <NavLink
                to="/dashboard"
                end // Fixes the issue
                className={({ isActive }) => (isActive ? styles.active : "")}
                onClick={isMobile ? closeSidebar : null}
              >
                <FontAwesomeIcon icon={faTachometerAlt} className={styles.icon} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/models"
                className={({ isActive }) => (isActive ? styles.active : "")}
                onClick={isMobile ? closeSidebar : null}
              >
                <FontAwesomeIcon icon={faTags} className={styles.icon} />
                <span>Models</span>
              </NavLink>
            </li>

            

            <li>
              <NavLink
                to="/dashboard/gallery"
                className={({ isActive }) => (isActive ? styles.active : "")}
                onClick={isMobile ? closeSidebar : null}
              >
                <FontAwesomeIcon icon={faImages} className={styles.icon} />
                <span>Gallery</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/upload"
                className={({ isActive }) => (isActive ? styles.active : "")}
                onClick={isMobile ? closeSidebar : null}
              >
                <FontAwesomeIcon icon={faCamera} className={styles.icon} />
                <span>Upload</span>
              </NavLink>
            </li>

           
          </ul>
        </nav>
      </div>
    </aside>
  );
}
