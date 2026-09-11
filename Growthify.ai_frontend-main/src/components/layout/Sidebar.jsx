import React, { useState, useEffect } from "react";
import { LayoutGrid, TrendingUp, Sparkles, Image, Folder, Calendar, Settings, Bookmark } from "lucide-react";
import axios from "axios";
import { C, font } from "../../theme/theme.js";
import "./Sidebar.css";

const navItems = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "Trends", icon: TrendingUp },
  { label: "Saves", icon: Bookmark },
  { label: "Content Generator", icon: Sparkles },
  { label: "Thumbnail Studio", icon: Image },
  { label: "Projects", icon: Folder },
  { label: "Schedule", icon: Calendar },
  { label: "Settings", icon: Settings },
];

const Sidebar = ({ activeItem = "Dashboard", onNavigate }) => {
  const [userData, setUserData] = useState({ name: "Loading...", email: "" });

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
        console.error("Sidebar user fetch error:", error);
        setUserData({ name: "User", email: "" });
      }
    };

    fetchUserData();
  }, []);

  return (
    <aside
      className="dashboardSidebar"
      style={{
        background: C.bgSidebar,
        borderRight: `1px solid ${C.border}`,
        fontFamily: font,
      }}
    >
      <div
        className="sidebarUser"
        style={{
          fontSize: 11,
          color: C.textMuted,
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${C.border}`,
        }}
      >
        {userData.name}
      </div>

      <nav className="sidebarNav">
        {navItems.map((item) => {
          const isActive = activeItem === item.label;
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.label)}
              className="sidebarNavBtn"
              style={{
                background: isActive ? C.accent : "transparent",
                color: isActive ? C.textDark : C.textSecondary,
                fontWeight: isActive ? 600 : 400,
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span className="sidebarNavLabel">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;


// import React, { useState, useEffect } from "react";
// import { LayoutGrid, TrendingUp, Sparkles, Image, Folder, Calendar, Settings, Bookmark } from "lucide-react";
// import axios from "axios";
// import { C, font } from "../../theme/theme.js";
// import "./Sidebar.css";

// const navItems = [
//   { label: "Dashboard", icon: LayoutGrid },
//   { label: "Trends", icon: TrendingUp },
//   { label: "Saves", icon: Bookmark },
//   { label: "Content Generator", icon: Sparkles },
//   { label: "Thumbnail Studio", icon: Image },
//   { label: "Projects", icon: Folder },
//   { label: "Schedule", icon: Calendar },
//   { label: "Settings", icon: Settings },
// ];

// const Sidebar = ({ activeItem = "Dashboard", onNavigate }) => {
//   const [userData, setUserData] = useState({ name: "Loading...", email: "" });

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("http://localhost:5000/api/user/me", {
//           headers: {
//             "Content-Type": "application/json",
//             ...(token && { Authorization: `Bearer ${token}` }),
//           },
//         });

//         setUserData({
//           name: response.data?.name || "User",
//           email: response.data?.email || "",
//         });
//       } catch (error) {
//         console.error("Sidebar user fetch error:", error);
//         setUserData({ name: "User", email: "" });
//       }
//     };

//     fetchUserData();
//   }, []);

//   return (
//     <aside
//       className="dashboardSidebar"
//       style={{
//         background: C.bgSidebar,
//         borderRight: `1px solid ${C.border}`,
//         fontFamily: font,
//       }}
//     >
//       <div
//         className="sidebarUser"
//         style={{
//           fontSize: 11,
//           color: C.textMuted,
//           background: "rgba(255,255,255,0.03)",
//           border: `1px solid ${C.border}`,
//         }}
//       >
//         {userData.name}
//       </div>

//       <nav className="sidebarNav">
//         {navItems.map((item) => {
//           const isActive = activeItem === item.label;
//           const Icon = item.icon;

//           return (
//             <button
//               key={item.label}
//               onClick={() => onNavigate(item.label)}
//               className="sidebarNavBtn"
//               style={{
//                 background: isActive ? C.accent : "transparent",
//                 color: isActive ? C.textDark : C.textSecondary,
//                 fontWeight: isActive ? 600 : 400,
//               }}
//               onMouseEnter={(e) => {
//                 if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
//               }}
//               onMouseLeave={(e) => {
//                 if (!isActive) e.currentTarget.style.background = "transparent";
//               }}
//             >
//               <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
//               <span className="sidebarNavLabel">{item.label}</span>
//             </button>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// };

// export default Sidebar;
