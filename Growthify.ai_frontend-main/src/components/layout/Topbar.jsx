import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { Plus, Rocket, LogOut, ChevronDown, User as UserIcon, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../context/AuthContext.jsx";

const Topbar = ({ onCreateProject, onSettingsClick }) => {
  const navigate = useNavigate();
  const { logout } = useContext(Context);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(() => (localStorage.getItem("theme") === "light" ? "light" : "dark"));
  const dropdownRef = useRef(null);
  const [userData, setUserData] = useState({ name: "", email: "" });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        // 🟢 Yahan URL ko short kar diya hai
        const response = await axios.get("/api/user/me", {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        setUserData({
          name: response.data?.name || "User",
          email: response.data?.email || "",
        });
      } catch (error) {
        console.error("Topbar user fetch error:", error.response?.data?.message || error.message);
      }
    };

    fetchUserData();
  }, []);

  
  const handleEditProfileClick = () => {
    setIsDropdownOpen(false);
    if (onSettingsClick) onSettingsClick();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="bg-brand-topbar border-b border-brand-border flex items-center justify-between gap-2 px-3 sm:px-6 py-2 sm:py-0 sm:h-14 shrink-0 z-40">
      <div className="flex min-w-0 items-center gap-2">
        <Rocket className="text-brand-accent shrink-0" size={20} />
        <span className="text-brand-textPrimary font-bold text-base sm:text-lg tracking-tight truncate max-[360px]:hidden">Growthify.ai</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={onCreateProject}
          className="flex items-center gap-1.5 bg-brand-accent text-brand-page px-3 sm:px-4 py-1.5 rounded-full font-bold text-[11px] sm:text-xs hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <Plus size={15} strokeWidth={3} />
          <span className="hidden sm:inline">New Project</span>
          <span className="sm:hidden">New</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
          className="p-2 border border-brand-border rounded-full text-brand-textSecondary hover:bg-brand-cardHover transition-colors"
          title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="relative flex items-center" ref={dropdownRef}>
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 ml-1 sm:ml-2 cursor-pointer border border-brand-border p-1 pr-2 sm:pr-3 rounded-full hover:bg-white/5 transition-colors max-w-[150px]"
          >
            <div className="w-7 h-7 rounded-full bg-brand-accent/20 flex items-center justify-center text-[10px] font-bold text-brand-accent border border-brand-accent/30 tracking-wider">
              {getInitials(userData.name)}
            </div>
            <span className="text-brand-textSecondary text-xs max-w-[76px] sm:max-w-[100px] truncate max-[420px]:hidden">
              {userData.name || "Creator"}
            </span>
            <ChevronDown
              size={14}
              className={`text-brand-textSecondary transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-brand-card border border-brand-border rounded-xl shadow-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-brand-border mb-1">
                <p className="text-[13px] text-brand-textPrimary font-medium truncate">
                  {userData.name ? userData.name : "Loading..."}
                </p>
                <p className="text-[11px] text-brand-textSecondary truncate">
                  {userData.email ? userData.email : "Loading..."}
                </p>
              </div>

              <button
                onClick={handleEditProfileClick}
                className="w-full text-left px-4 py-2 text-[14px] text-brand-textSecondary hover:bg-brand-accent/10 hover:text-brand-accent flex items-center gap-3 transition-colors"
              >
                <UserIcon size={16} />
                Edit Profile
              </button>
            </div>
          )}
        </div>

        <button onClick={handleLogout} className="p-2 text-brand-textSecondary hover:bg-white/5 rounded-lg transition-colors ml-0 sm:ml-2" title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
