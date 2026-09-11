import React, { useState } from "react";
import { ShieldCheck, User, Globe } from "lucide-react"; // Globe icon add kiya
import { font } from "../theme/theme.js";
import SettingsItem from "./SettingsItem.jsx";
import AccountTab from "./AccountTab.jsx";
import SecurityTab from "./SecurityTab.jsx";
import SocialMediaTab from "./SocialMediaTab.jsx"; // Naya component import kiya
import styles from "./settings.module.css";

const Settings = () => {
  const [activeTab, setActiveTab] = useState(null);
  
  // Global Error/Success states for the page
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearAlerts = () => {
    setError("");
    setSuccess("");
  };

  const handleTabToggle = (tabName) => {
    setActiveTab(activeTab === tabName ? null : tabName);
    clearAlerts(); // Clear alerts when switching tabs
  };

  return (
    <div className={styles.container} style={{ fontFamily: font }}>
      <h1 className={styles.title}>Settings</h1>

      {/* Global Alert Box */}
      {(error || success) && (
        <div className={`${styles.alert} ${error ? styles.error : styles.success}`}>
          {error || success}
        </div>
      )}

      {/* --- ACCOUNT INFORMATION TAB --- */}
      <SettingsItem
        icon={User}
        label="Account Information"
        isOpen={activeTab === "account"}
        onClick={() => handleTabToggle("account")}
      >
        <AccountTab 
          isOpen={activeTab === "account"} 
          onError={setError} 
          onSuccess={setSuccess} 
        />
      </SettingsItem>

      {/* --- SOCIAL MEDIA CONNECTION TAB (NEW) --- */}
      <SettingsItem
        icon={Globe}
        label="Social Media Connections"
        isOpen={activeTab === "social"}
        onClick={() => handleTabToggle("social")}
      >
        <SocialMediaTab 
          isOpen={activeTab === "social"} 
          onError={setError} 
          onSuccess={setSuccess} 
        />
      </SettingsItem>

      {/* --- PRIVACY & SECURITY TAB --- */}
      <SettingsItem
        icon={ShieldCheck}
        label="Privacy & Security"
        isOpen={activeTab === "security"}
        onClick={() => handleTabToggle("security")}
      >
        <SecurityTab 
          onError={setError} 
          onSuccess={setSuccess} 
        />
      </SettingsItem>

    </div>
  );
};

export default Settings;












// import React, { useState } from "react";
// import { ShieldCheck, User } from "lucide-react";
// import { font } from "../theme/theme.js";
// import SettingsItem from "./SettingsItem.jsx";
// import AccountTab from "./AccountTab.jsx";
// import SecurityTab from "./SecurityTab.jsx";
// import styles from "./settings.module.css";

// const Settings = () => {
//   const [activeTab, setActiveTab] = useState(null);
  
//   // Global Error/Success states for the page
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const clearAlerts = () => {
//     setError("");
//     setSuccess("");
//   };

//   const handleTabToggle = (tabName) => {
//     setActiveTab(activeTab === tabName ? null : tabName);
//     clearAlerts(); // Clear alerts when switching tabs
//   };

//   return (
//     <div className={styles.container} style={{ fontFamily: font }}>
//       <h1 className={styles.title}>Settings</h1>

//       {/* Global Alert Box */}
//       {(error || success) && (
//         <div className={`${styles.alert} ${error ? styles.error : styles.success}`}>
//           {error || success}
//         </div>
//       )}

//       {/* --- ACCOUNT INFORMATION TAB --- */}
//       <SettingsItem
//         icon={User}
//         label="Account Information"
//         isOpen={activeTab === "account"}
//         onClick={() => handleTabToggle("account")}
//       >
//         <AccountTab 
//           isOpen={activeTab === "account"} 
//           onError={setError} 
//           onSuccess={setSuccess} 
//         />
//       </SettingsItem>

//       {/* --- PRIVACY & SECURITY TAB --- */}
//       <SettingsItem
//         icon={ShieldCheck}
//         label="Privacy & Security"
//         isOpen={activeTab === "security"}
//         onClick={() => handleTabToggle("security")}
//       >
//         <SecurityTab 
//           onError={setError} 
//           onSuccess={setSuccess} 
//         />
//       </SettingsItem>

//     </div>
//   );
// };

// export default Settings;









