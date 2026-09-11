import React, { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import axios from "axios";
import { C, font } from "../../theme/theme.js";
import styles from "./Projects.module.css";
import ProjectCard from "../../components/common/ProjectCard.jsx";
import ProjectModal from "../../components/common/ProjectModal.jsx";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/projects", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setProjects(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
    const title = p.title || p.topic || "";
    const matchesSearch = title.toLowerCase().includes(search.toLowerCase());

    const dbStatus = (p.status || "draft").toLowerCase().replace("-", " ");
    const filterStatus = filter.toLowerCase().replace("-", " ");
    const matchesFilter = filter === "All" || dbStatus === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ fontFamily: font, animation: "fadeIn 0.3s" }}>
      <div className={styles.headerArea}>
        <div>
          <h1 style={{ color: C.textPrimary, fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>Projects</h1>
          <p style={{ color: C.textSecondary, fontSize: 14.5, marginTop: 8 }}>Manage your content workflows and AI-generated assets.</p>
        </div>

        <div className={styles.searchFilterGroup}>
          <div style={{ position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: 12, top: 10, color: C.textSecondary }} />
            <input
              type="text"
              placeholder="Search projects..."
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select className={styles.filterSelect} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">Filter: All</option>
            <option value="Draft">Draft</option>
            <option value="In Progress">In Progress</option>
            <option value="Published">Published</option>
            <option value="Scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "50px 0" }}>
          <Loader2 className="animate-spin text-brand-accent" size={40} />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div style={{ color: C.textSecondary, textAlign: "center", padding: "40px 0" }}>
          No projects found.
        </div>
      ) : (
        <div className={styles.projectsGrid}>
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onClick={(data) => setSelectedProject(data)}
            />
          ))}
        </div>
      )}

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          refreshProjects={fetchProjects}
        />
      )}
    </div>
  );
};

export default Projects;
