import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast"; // 🟢 Toast import kar liya
import { Lock } from "lucide-react";
import styles from "./settings.module.css";

const SecurityTab = ({ onError, onSuccess }) => {
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);

  // Axios config for token headers
  const getAxiosConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      }
    };
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    // Check if new passwords match
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error("New passwords do not match."); // 🟢 Error Toast
      if (onError) onError("New passwords do not match.");
      return;
    }
    
    setSavingPassword(true);
    if (onError) onError(""); 
    if (onSuccess) onSuccess("");
    
    try {
      // 🟢 Axios aur clean URL ka use
      await axios.put(
        "/api/user/change-password",
        {
          currentPassword: securityForm.currentPassword,
          newPassword: securityForm.newPassword,
        },
        getAxiosConfig()
      );
      
      // 🟢 Success Toast
      toast.success("Password updated! Going to Home screen...");
      if (onSuccess) onSuccess("Password updated successfully!");
      
      setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      
      // 🟢 1.5 second baad reload, jo automatically Home (Dashboard) par le jayega
      setTimeout(() => {
        window.location.reload(); 
      }, 1500);

    } catch (err) {
      // 🟢 API Error Toast
      const errorMsg = err.response?.data?.message || "Password update failed.";
      toast.error(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <form onSubmit={handlePasswordUpdate}>
      <label className={styles.label}>Current Password</label>
      <input
        className={styles.input} type="password" required
        value={securityForm.currentPassword}
        onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
      />
      
      <label className={styles.label}>New Password</label>
      <input
        className={styles.input} type="password" required
        value={securityForm.newPassword}
        onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
      />
      
      <label className={styles.label}>Confirm New Password</label>
      <input
        className={styles.input} type="password" required
        value={securityForm.confirmPassword}
        onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
      />
      
      <button type="submit" className={styles.button} disabled={savingPassword} style={{ marginTop: 10 }}>
        <Lock size={16} /> {savingPassword ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
};

export default SecurityTab;