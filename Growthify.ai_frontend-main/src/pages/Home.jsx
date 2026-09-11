import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { C } from "../theme/theme.js";
import { Context } from "../context/AuthContext.jsx";
import StatsCards from "../components/home-widgets/StatsCards.jsx";
import PlatformCards from "../components/home-widgets/PlatformCards.jsx";
import RecentProjects from "../components/home-widgets/RecentProjects.jsx";

const Home = ({ onProjectClick }) => {
  const { user } = useContext(Context);
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get("/api/dashboard");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoadingDashboard(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out" }} className="space-y-6">
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            color: C.textPrimary,
            fontSize: 24,
            fontWeight: 800,
            margin: 0,
          }}
        >
          Welcome back, {user?.name || "Creator"}
        </h1>
        <p style={{ color: C.textSecondary, fontSize: 13.5, marginTop: 6 }}>
          Here&apos;s an overview of your creator performance.
        </p>
      </div>

      <section className="bg-brand-card/30 border border-brand-border rounded-2xl p-5">
        <h2 className="text-brand-textPrimary text-sm font-bold mb-4">
          Social Media Platform Growth
        </h2>
        <PlatformCards />
      </section>

      <section className="bg-brand-card/30 border border-brand-border rounded-2xl p-5">
        <h2 className="text-brand-textPrimary text-sm font-bold mb-4">
          Projects
        </h2>
        <StatsCards stats={dashboardData} loading={loadingDashboard} />
        <RecentProjects
          projects={dashboardData?.recentProjects || []}
          loading={loadingDashboard}
          onProjectClick={onProjectClick}
        />
      </section>
    </div>
  );
};

export default Home;
