import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast"; // 🟢 Toast import kar liya
import { Save, Youtube, Instagram, MessageCircle, Share2 } from "lucide-react";
import styles from "./settings.module.css";

const SocialMediaTab = ({ isOpen, onError, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [socialLinks, setSocialLinks] = useState({
    youtube: "",
    instagram: "",
    snapchat: "",
    reddit: "",
  });

  // 🟢 Axios ke liye config function
  const getAxiosConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` })
      }
    };
  };

  // Jab tab open ho toh backend se existing links fetch karlo
  useEffect(() => {
    if (!isOpen) return; 

    const fetchSocialLinks = async () => {
      setLoading(true);
      try {
        // 🟢 Clean Short URL with Axios
        const response = await axios.get("/api/user/social-links", getAxiosConfig());
        const data = response.data;
        
        setSocialLinks({
          youtube: data?.youtube || "",
          instagram: data?.instagram || "",
          snapchat: data?.snapchat || "",
          reddit: data?.reddit || "",
        });
      } catch {
        console.warn("No existing social links found or backend route not ready yet.");
      } finally {
        setLoading(false);
      }
    };

    fetchSocialLinks();
  }, [isOpen]);

  const handleChange = (e) => {
    setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });
  };

  const handleSaveLinks = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (onError) onError(""); 
    if (onSuccess) onSuccess("");
    
    try {
      // 🟢 Short URL with Axios PUT request
      await axios.put(
        "/api/user/social-links", 
        socialLinks, 
        getAxiosConfig()
      );
      
      // 🟢 Success aane par mast Toast
      toast.success("Social media links saved successfully!");
      if (onSuccess) onSuccess("Social media links updated successfully!");
    } catch (error) {
      // 🟢 Error aane par laal Toast
      const errMsg = error.response?.data?.message || "Failed to update social links.";
      toast.error(errMsg);
      if (onError) onError(errMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className={styles.label}>Loading links...</p>;

  return (
    <form onSubmit={handleSaveLinks}>
      <label className={styles.label}>YouTube Channel Link</label>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
        <Youtube color="#ef4444" size={20} />
        <input
          className={styles.input} type="url" name="youtube" placeholder="https://youtube.com/c/yourchannel"
          value={socialLinks.youtube} onChange={handleChange} style={{ marginBottom: 0 }}
        />
      </div>

      <label className={styles.label}>Instagram Profile Link</label>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
        <Instagram color="#e1306c" size={20} />
        <input
          className={styles.input} type="url" name="instagram" placeholder="https://instagram.com/yourprofile"
          value={socialLinks.instagram} onChange={handleChange} style={{ marginBottom: 0 }}
        />
      </div>

      <label className={styles.label}>Snapchat Link</label>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
        <Share2 color="#fffc00" size={20} />
        <input
          className={styles.input} type="url" name="snapchat" placeholder="https://snapchat.com/add/yourusername"
          value={socialLinks.snapchat} onChange={handleChange} style={{ marginBottom: 0 }}
        />
      </div>

      <label className={styles.label}>Reddit Profile Link</label>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <MessageCircle color="#ff4500" size={20} />
        <input
          className={styles.input} type="url" name="reddit" placeholder="https://reddit.com/user/yourusername"
          value={socialLinks.reddit} onChange={handleChange} style={{ marginBottom: 0 }}
        />
      </div>

      <button type="submit" className={styles.button} disabled={saving}>
        <Save size={16} /> {saving ? "Saving..." : "Save Links"}
      </button>
    </form>
  );
};

export default SocialMediaTab;


// import React, { useState, useEffect } from "react";
// import { Save, Youtube, Instagram, MessageCircle, Share2 } from "lucide-react";
// import styles from "./settings.module.css";

// const API_BASE_URL = "http://localhost:5000";

// const SocialMediaTab = ({ isOpen, onError, onSuccess }) => {
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
  
//   const [socialLinks, setSocialLinks] = useState({
//     youtube: "",
//     instagram: "",
//     snapchat: "",
//     reddit: "",
//   });

//   const getHeaders = () => {
//     const token = localStorage.getItem("token");
//     return {
//       "Content-Type": "application/json",
//       ...(token && { Authorization: `Bearer ${token}` })
//     };
//   };

//   // Jab tab open ho toh backend se existing links fetch karlo
//   useEffect(() => {
//     if (!isOpen) return; // Agar tab band hai toh fetch mat karo

//     const fetchSocialLinks = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(`${API_BASE_URL}/api/user/social-links`, { headers: getHeaders() });
//         if (!response.ok) throw new Error("Failed to load social links.");
//         const data = await response.json();
//         // Agar backend se data aata hai toh set karo
//         setSocialLinks({
//           youtube: data?.youtube || "",
//           instagram: data?.instagram || "",
//           snapchat: data?.snapchat || "",
//           reddit: data?.reddit || "",
//         });
//       } catch (err) {
//         console.warn("No existing social links found or backend route not ready yet.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSocialLinks();
//   }, [isOpen]);

//   const handleChange = (e) => {
//     setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });
//   };

//   const handleSaveLinks = async (e) => {
//     e.preventDefault();
//     setSaving(true);
//     onError(""); onSuccess("");
    
//     try {
//       // Backend pe save karne ki request
//       const response = await fetch(`${API_BASE_URL}/api/user/social-links`, {
//         method: "PUT",
//         headers: getHeaders(),
//         body: JSON.stringify(socialLinks),
//       });
      
//       if (!response.ok) throw new Error("Failed to update social links.");
//       onSuccess("Social media links updated successfully!");
//     } catch (err) {
//       onError(err.message);
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <p className={styles.label}>Loading links...</p>;

//   return (
//     <form onSubmit={handleSaveLinks}>
//       <label className={styles.label}>YouTube Channel Link</label>
//       <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
//         <Youtube color="#ef4444" size={20} />
//         <input
//           className={styles.input} type="url" name="youtube" placeholder="https://youtube.com/c/yourchannel"
//           value={socialLinks.youtube} onChange={handleChange} style={{ marginBottom: 0 }}
//         />
//       </div>

//       <label className={styles.label}>Instagram Profile Link</label>
//       <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
//         <Instagram color="#e1306c" size={20} />
//         <input
//           className={styles.input} type="url" name="instagram" placeholder="https://instagram.com/yourprofile"
//           value={socialLinks.instagram} onChange={handleChange} style={{ marginBottom: 0 }}
//         />
//       </div>

//       <label className={styles.label}>Snapchat Link</label>
//       <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
//         <Share2 color="#fffc00" size={20} />
//         <input
//           className={styles.input} type="url" name="snapchat" placeholder="https://snapchat.com/add/yourusername"
//           value={socialLinks.snapchat} onChange={handleChange} style={{ marginBottom: 0 }}
//         />
//       </div>

//       <label className={styles.label}>Reddit Profile Link</label>
//       <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
//         <MessageCircle color="#ff4500" size={20} />
//         <input
//           className={styles.input} type="url" name="reddit" placeholder="https://reddit.com/user/yourusername"
//           value={socialLinks.reddit} onChange={handleChange} style={{ marginBottom: 0 }}
//         />
//       </div>

//       <button type="submit" className={styles.button} disabled={saving}>
//         <Save size={16} /> {saving ? "Saving..." : "Save Links"}
//       </button>
//     </form>
//   );
// };

// export default SocialMediaTab;
