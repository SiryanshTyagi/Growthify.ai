import Project from "../models/Project.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total Projects
    const totalProjects = await Project.countDocuments({ user: userId });

    // Status Counts
    const draftCount = await Project.countDocuments({
      user: userId,
      status: "draft",
    });

    const publishedCount = await Project.countDocuments({
      user: userId,
      status: "published",
    });

    // Published This Week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const publishedThisWeek = await Project.countDocuments({
      user: userId,
      status: "published",
      createdAt: { $gte: oneWeekAgo },
    });

    // Recent Projects
    const recentProjects = await Project.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({
      totalProjects,
      draftCount,
      publishedCount,
      publishedThisWeek,
      recentProjects,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};
