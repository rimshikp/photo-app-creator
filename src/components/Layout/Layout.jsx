import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { useState, useEffect } from "react";
import styles from "../Sidebar/Sidebar.module.css";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsSidebarOpen(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.layoutContainer}>
      <Header
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
      />
      <div className={styles.mainContent}>
        <Sidebar
          isOpen={isSidebarOpen}
          closeSidebar={closeSidebar}
          isMobile={isMobile}
        />
        {isMobile && (
          <div
            className={`${styles.overlay} ${
              isSidebarOpen ? styles.showOverlay : ""
            }`}
            onClick={closeSidebar}
          ></div>
        )}
        <div
          className={`${styles.content} ${
            !isMobile && isSidebarOpen ? styles.withSidebar : ""
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
