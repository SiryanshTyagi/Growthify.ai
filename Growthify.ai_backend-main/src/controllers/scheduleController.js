import ScheduleItem from "../models/ScheduleItem.js";

const isValidMonth = (month) => /^\d{4}-\d{2}$/.test(String(month || ""));
const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(String(date || ""));

const normalizeTaskInput = (body) => {
  const type = body.type === "unscheduled" ? "unscheduled" : "scheduled";
  const text = String(body.text || "").trim();
  const priority = ["low", "medium", "high"].includes(body.priority)
    ? body.priority
    : "medium";
  const date = type === "scheduled" ? String(body.date || "").trim() : "";

  return { text, type, priority, date };
};

export const getScheduleItems = async (req, res, next) => {
  try {
    const { month } = req.query;
    const userId = req.user._id;

    if (!isValidMonth(month)) {
      return res.status(400).json({
        success: false,
        message: "month query must use YYYY-MM format",
      });
    }

    const items = await ScheduleItem.find({
      userId,
      $or: [
        { type: "unscheduled" },
        { type: "scheduled", date: { $regex: `^${month}-` } },
      ],
    }).sort({ type: 1, date: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

export const createScheduleItem = async (req, res, next) => {
  try {
    const input = normalizeTaskInput(req.body);

    if (!input.text) {
      return res.status(400).json({ success: false, message: "Task text is required" });
    }

    if (input.type === "scheduled" && !isValidDate(input.date)) {
      return res.status(400).json({
        success: false,
        message: "Scheduled tasks require a date in YYYY-MM-DD format",
      });
    }

    const item = await ScheduleItem.create({
      userId: req.user._id,
      ...input,
    });

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const updateScheduleItem = async (req, res, next) => {
  try {
    const input = normalizeTaskInput(req.body);

    if (!input.text) {
      return res.status(400).json({ success: false, message: "Task text is required" });
    }

    if (input.type === "scheduled" && !isValidDate(input.date)) {
      return res.status(400).json({
        success: false,
        message: "Scheduled tasks require a date in YYYY-MM-DD format",
      });
    }

    const item = await ScheduleItem.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      input,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteScheduleItem = async (req, res, next) => {
  try {
    const item = await ScheduleItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted",
    });
  } catch (error) {
    next(error);
  }
};
