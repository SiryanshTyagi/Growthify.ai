



import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Edit3, LogOut } from "lucide-react";
import styles from "./settings.module.css";

const AccountTab = ({ isOpen, onError, onSuccess }) => {
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [userData, setUserData] = useState({ name: "", email: "" });
  
  const [accountMode, setAccountMode] = useState("view"); 
  const [newName, setNewName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const getAxiosConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      }
    };
  };

  // Reset states when tab is closed
  useEffect(() => {
    if (!isOpen) {
      setAccountMode("view");
      setNewName(userData.name);
    }
  }, [isOpen, userData.name]);

  // Profile Fetch Logic (Clean URL)
  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        // 🟢 Yahan URL chota kar diya
        const response = await axios.get("/api/user/me", getAxiosConfig());
        const data = response.data;
        setUserData({ name: data?.name || "", email: data?.email || "" });
        setNewName(data?.name || "");
      } catch (err) {
        toast.error(err.response?.data?.message || "Could not load user profile.");
        if (onError) onError(err.response?.data?.message || "Could not load user data.");
      } finally {
        setLoadingProfile(false);
      }
    };
    if (isOpen) fetchProfile();
  }, [isOpen, onError]);

  // Name Update Logic (Clean URL)
  const handleNameUpdate = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    if (onError) onError(""); 
    if (onSuccess) onSuccess("");
    
    try {
      // 🟢 Yahan bhi URL chota kar diya
      await axios.put(
        "/api/user/update-name", 
        { name: newName },
        getAxiosConfig()
      );
      
      toast.success("Name updated successfully!");
      if (onSuccess) onSuccess("Name updated successfully! Reloading...");
      
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update name.");
      if (onError) onError(err.response?.data?.message || "Update failed.");
      setIsProcessing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    setTimeout(() => {
      window.location.href = "/login";
    }, 500);
  };

  const cancelEdit = () => {
    setAccountMode("view");
    setNewName(userData.name);
    if (onError) onError("");
  };

  if (loadingProfile) return <p className={styles.label}>Loading details...</p>;

  return (
    <>
      {accountMode === "view" && (
        <div>
          <div className={styles.infoBox}>
            <div className={styles.infoRow}>
              <div>
                <div className={styles.infoLabel}>Name</div>
                <div className={styles.infoText}>{userData.name}</div>
              </div>
            </div>
            <div className={styles.infoRow}>
              <div>
                <div className={styles.infoLabel}>Email</div>
                <div className={styles.infoText}>{userData.email}</div>
              </div>
            </div>
            <div className={styles.infoRow}>
              <div>
                <div className={styles.infoLabel}>Password</div>
                <div className={styles.infoText}>********</div>
              </div>
            </div>
          </div>
          <div className={styles.btnGroup}>
            <button onClick={() => setAccountMode("edit")} className={styles.button}>
              <Edit3 size={16} /> Change Name
            </button>
            <button onClick={handleLogout} className={`${styles.button} ${styles.buttonDanger}`}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      )}

      {accountMode === "edit" && (
        <form onSubmit={handleNameUpdate}>
          <label className={styles.label}>Update Name</label>
          <input
            className={styles.input} type="text" placeholder="New User Name"
            value={newName} onChange={(e) => setNewName(e.target.value)}
            autoFocus required
          />
          <div className={styles.btnGroup}>
            <button type="submit" className={styles.button} disabled={isProcessing}>
              {isProcessing ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={cancelEdit} className={`${styles.button} ${styles.buttonSecondary}`}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default AccountTab;