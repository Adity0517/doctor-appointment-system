import React, { useState } from "react";
import "./Layou.css";
import { adminMenu, userMenu } from "./../Data/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, message } from "antd";
import SymptomChecker from "./SymptomChecker";
import LanguageToggle from "./LanguageToggle";
const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  /* ── logout ── */
  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    navigate("/login");
  };

  /* ── doctor menu ── */
  const doctorMenu = [
    { name: "Home",         path: "/home",                      icon: "fa-solid fa-house" },
    { name: "Appointments", path: "/doctor-appointments",        icon: "fa-solid fa-calendar-check" },
    { name: "Profile",      path: `/doctor/profile/${user?._id}`,icon: "fa-solid fa-user-doctor" },
  ];

  const SidebarMenu = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;

  /* ── user initials avatar ── */
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className={`lyt-root${darkMode ? " lyt-dark" : ""}`}>

      {/* ── MOBILE OVERLAY ── */}
      {sidebarOpen && (
        <div className="lyt-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className={`lyt-sidebar${sidebarOpen ? " lyt-sidebar--open" : ""}`}>

        {/* Logo */}
        <div className="lyt-logo">
          <span className="lyt-logo__icon">🏥</span>
          <span className="lyt-logo__text">Health<span className="lyt-logo__accent">Care+</span></span>
          <button className="lyt-sidebar__close" onClick={() => setSidebarOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* User card */}
        <div className="lyt-user-card">
          <div className="lyt-avatar">{initials}</div>
          <div className="lyt-user-card__info">
            <p className="lyt-user-card__name">{user?.name || "User"}</p>
            <p className="lyt-user-card__role">
              {user?.isAdmin ? "Administrator" : user?.isDoctor ? "Doctor" : "Patient"}
            </p>
          </div>
        </div>

        <div className="lyt-divider" />

        {/* Nav links */}
        <nav className="lyt-nav">
          {SidebarMenu.map((menu) => {
            const isActive = location.pathname === menu.path;
            return (
              <Link
                key={menu.path}
                to={menu.path}
                className={`lyt-nav__item${isActive ? " lyt-nav__item--active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className={`${menu.icon} lyt-nav__icon`}></i>
                <span className="lyt-nav__label">{menu.name}</span>
                {isActive && <span className="lyt-nav__bar" />}
              </Link>
            );
          })}
        </nav>

        <div className="lyt-divider" />

        {/* Logout */}
        <button className="lyt-logout" onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket lyt-nav__icon"></i>
          <span>Logout</span>
        </button>

        {/* Bottom brand */}
        <p className="lyt-sidebar__brand">© 2026 HealthCare+</p>
      </aside>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <div className="lyt-main">

        {/* ── HEADER ── */}
        <header className="lyt-header">

          {/* Mobile hamburger */}
          <button className="lyt-hamburger" onClick={() => setSidebarOpen(true)}>
            <i className="fa-solid fa-bars"></i>
          </button>

          {/* Page title (auto from path) */}
          <div className="lyt-header__title">
            {SidebarMenu.find((m) => m.path === location.pathname)?.name || "Dashboard"}
          </div>

          {/* Right actions */}
          <div className="lyt-header__actions">

            {/* Dark mode toggle */}
            <button
              className="lyt-icon-btn"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? (
                <i className="fa-solid fa-sun"></i>
              ) : (
                <i className="fa-solid fa-moon"></i>
              )}
            </button>
<LanguageToggle/>
            {/* Notifications */}
            <button
              className="lyt-icon-btn"
              onClick={() => navigate("/notification")}
              title="Notifications"
            >
              <Badge
                count={user?.notifcation?.length || 0}
                size="small"
                offset={[2, -2]}
              >
                <i className="fa-solid fa-bell"></i>
              </Badge>
            </button>

            {/* User info */}
            <div className="lyt-header__user">
              <div className="lyt-avatar lyt-avatar--sm">{initials}</div>
              <div className="lyt-header__user-info">
                <span className="lyt-header__user-name">{user?.name || "User"}</span>
                <span className="lyt-header__user-role">
                  {user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "Patient"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* ── PAGE BODY ── */}
        <main className="lyt-body">
          {children}
        </main>
        <SymptomChecker/>
      </div>
    </div>
  );
};

export default Layout;
