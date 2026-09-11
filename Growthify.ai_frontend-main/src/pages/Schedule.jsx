import React, { useEffect, useState } from "react";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Edit2,
  ListTodo,
  Plus,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import styles from "./schedule.module.css";

const Schedule = () => {
  const [activeTab, setActiveTab] = useState("scheduled");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [savingTask, setSavingTask] = useState(false);

  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("medium");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [tasks, setTasks] = useState([]);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthQuery = `${year}-${String(month + 1).padStart(2, "0")}`;

  const formatDate = (y, m, d) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const normalizeTask = (task) => ({
    ...task,
    id: task._id || task.id,
    text: task.text || "",
    type: task.type || "scheduled",
    priority: task.priority || "medium",
    date: task.date || "",
  });

  const isTaskVisibleInCurrentMonth = (task) =>
    task.type === "unscheduled" || task.date?.startsWith(`${monthQuery}-`);

  const resetForm = () => {
    setNewTaskText("");
    setNewTaskDate("");
    setNewTaskPriority("medium");
    setEditingTaskId(null);
  };

  const prevMonth = () => {
    const nextDate = new Date(year, month - 1, 1);
    setCurrentDate(nextDate);
    setSelectedDate(nextDate);
    resetForm();
  };

  const nextMonth = () => {
    const nextDate = new Date(year, month + 1, 1);
    setCurrentDate(nextDate);
    setSelectedDate(nextDate);
    resetForm();
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoadingTasks(true);
        const res = await axios.get(`/api/schedule?month=${monthQuery}`, getAuthConfig());

        if (res.data?.success) {
          setTasks((res.data.data || []).map(normalizeTask));
        }
      } catch (error) {
        console.error("Error fetching schedule tasks:", error);
        toast.error(error.response?.data?.message || "Failed to load schedule");
      } finally {
        setLoadingTasks(false);
      }
    };

    fetchTasks();
  }, [monthQuery]);

  const handleAddOrUpdateTask = async () => {
    const text = newTaskText.trim();

    if (!text) {
      toast.error("Task text is required");
      return;
    }

    if (activeTab === "scheduled" && !newTaskDate) {
      toast.error("Please choose a date for scheduled tasks");
      return;
    }

    const payload = {
      text,
      type: activeTab,
      priority: newTaskPriority,
      date: activeTab === "scheduled" ? newTaskDate : "",
    };

    try {
      setSavingTask(true);

      if (editingTaskId) {
        const res = await axios.put(`/api/schedule/${editingTaskId}`, payload, getAuthConfig());
        const updatedTask = normalizeTask(res.data.data);

        setTasks((prevTasks) => {
          const withoutEdited = prevTasks.filter((task) => task.id !== editingTaskId);
          return isTaskVisibleInCurrentMonth(updatedTask)
            ? [...withoutEdited, updatedTask]
            : withoutEdited;
        });
        toast.success("Task updated");
      } else {
        const res = await axios.post("/api/schedule", payload, getAuthConfig());
        const createdTask = normalizeTask(res.data.data);

        if (isTaskVisibleInCurrentMonth(createdTask)) {
          setTasks((prevTasks) => [...prevTasks, createdTask]);
        }
        toast.success("Task added");
      }

      resetForm();
    } catch (error) {
      console.error("Error saving schedule task:", error);
      toast.error(error.response?.data?.message || "Failed to save task");
    } finally {
      setSavingTask(false);
    }
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setNewTaskText(task.text);
    setNewTaskPriority(task.priority);
    setNewTaskDate(task.date || "");
    setActiveTab(task.type);
  };

  const handleCompleteTask = async (id) => {
    try {
      await axios.delete(`/api/schedule/${id}`, getAuthConfig());
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      toast.success("Task completed");
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error(error.response?.data?.message || "Failed to complete task");
    }
  };

  const selectedDateString = formatDate(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  );
  const filteredTasks = tasks.filter((task) => task.type === activeTab);

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <h2 className={styles.title}><CalendarIcon color="#0ea5e9" /> Calendar</h2>

        <div className={styles.calendarHeader}>
          <button onClick={prevMonth} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><ChevronLeft /></button>
          <span>{currentDate.toLocaleString("default", { month: "long" })} {year}</span>
          <button onClick={nextMonth} style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}><ChevronRight /></button>
        </div>

        <div className={styles.weekdays}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div key={day}>{day}</div>)}
        </div>

        <div className={styles.daysGrid}>
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className={`${styles.dayCell} ${styles.empty}`}></div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const thisCellDate = formatDate(year, month, dayNum);
            const dayTasks = tasks.filter((task) => task.date === thisCellDate && task.type === "scheduled");
            const isSelected = selectedDateString === thisCellDate;

            return (
              <div
                key={dayNum}
                className={`${styles.dayCell} ${isSelected ? styles.active : ""}`}
                onClick={() => {
                  setSelectedDate(new Date(year, month, dayNum));
                  setNewTaskDate(thisCellDate);
                  setActiveTab("scheduled");
                }}
              >
                {dayNum}

                <div className={styles.dotsContainer}>
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`${styles.taskDot} ${
                        task.priority === "high" ? styles.dotHigh :
                        task.priority === "medium" ? styles.dotMedium : styles.dotLow
                      }`}
                      title={task.text}
                    ></div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.panel}>
        <h2 className={styles.title}><ListTodo color="#10b981" /> Tasks & Planning</h2>

        <div className={styles.tabs}>
          <button className={`${styles.tabBtn} ${activeTab === "scheduled" ? styles.activeTab : ""}`} onClick={() => setActiveTab("scheduled")}>Scheduled Task</button>
          <button className={`${styles.tabBtn} ${activeTab === "unscheduled" ? styles.activeTab : ""}`} onClick={() => setActiveTab("unscheduled")}>Non Scheduled Task</button>
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputRow}>
            <input
              type="text"
              placeholder="What needs to be done?"
              className={styles.input}
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
            />
            <select
              className={styles.prioritySelect}
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          {activeTab === "scheduled" && (
            <input
              type="date"
              className={styles.input}
              value={newTaskDate}
              onChange={(e) => setNewTaskDate(e.target.value)}
            />
          )}

          <div className={styles.formButtons}>
            <button onClick={handleAddOrUpdateTask} className={styles.addBtn} disabled={savingTask}>
              {editingTaskId ? (
                <><Check size={18} style={{ verticalAlign: "middle", marginRight: 5 }} /> {savingTask ? "Updating..." : "Update Task"}</>
              ) : (
                <><Plus size={18} style={{ verticalAlign: "middle", marginRight: 5 }} /> {savingTask ? "Adding..." : "Add Task"}</>
              )}
            </button>

            {editingTaskId && (
              <button onClick={resetForm} className={styles.cancelBtn}>
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className={styles.taskList}>
          {loadingTasks ? (
            <p style={{ color: "#94a3b8", textAlign: "center", marginTop: 20 }}>Loading tasks...</p>
          ) : filteredTasks.length === 0 ? (
            <p style={{ color: "#94a3b8", textAlign: "center", marginTop: 20 }}>All done for now!</p>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className={styles.taskItem}>
                <div className={styles.taskContent}>
                  <div className={styles.radioBtn} onClick={() => handleCompleteTask(task.id)} title="Mark as done"></div>
                  <div>
                    <div className={styles.taskText}>{task.text}</div>
                    {task.date && <div className={styles.taskDate}>{task.date}</div>}
                  </div>
                </div>

                <div className={styles.taskActions}>
                  <div className={`${styles.priorityBadge} ${
                    task.priority === "high" ? styles.badgeHigh :
                    task.priority === "medium" ? styles.badgeMedium : styles.badgeLow
                  }`}>
                    {task.priority}
                  </div>

                  <button
                    className={styles.editBtn}
                    onClick={() => handleEditClick(task)}
                    title="Edit Task"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
