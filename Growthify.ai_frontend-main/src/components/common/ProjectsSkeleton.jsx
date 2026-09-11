import React from "react";
import styles from "../../pages/Projects/Projects.module.css";

const ProjectsSkeleton = () => {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <div key={i} className={styles.card}>
          <div style={{
            height: 150,
            background: "#1f1f1f",
            borderRadius: 12,
            marginBottom: 12,
            animation: "pulse 1.5s infinite"
          }} />
          <div style={{
            height: 16,
            background: "#1f1f1f",
            width: "70%",
            marginBottom: 8,
            borderRadius: 6
          }} />
          <div style={{
            height: 12,
            background: "#1f1f1f",
            width: "40%",
            borderRadius: 6
          }} />
        </div>
      ))}
    </>
  );
};

export default ProjectsSkeleton;