import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiTask } from "react-icons/si";
import { PiPlant } from "react-icons/pi";
import { FaCaretDown, FaCheck, FaTrash } from "react-icons/fa";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Task {
  _id: string;
  name: string;
  isCompleted: boolean;
  plant_name: string;
}

interface Plant {
  _id: string;
  name: string;
}

const Tasks = () => {
  const [taskName, setTaskName] = useState("");
  const [plantName, setPlantName] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("_id");
      if (!userId) {
        toast.error("User not found. Please log in again.");
        return;
      }

      setIsLoading(true);
      try {
        const [tasksRes, plantsRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/task/getTasksByUserId/${userId}`,
            {
              headers: { Authorization: localStorage.getItem("token") },
              withCredentials: true,
            }
          ),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/plant/getPlantsByUserId/${userId}?page=1&limit=50`,
            {
              headers: { Authorization: localStorage.getItem("token") },
              withCredentials: true,
            }
          ),
        ]);

        setTasks(tasksRes.data.filter((t: Task) => !t.isCompleted));
        setPlants(
          plantsRes.data.data
            ? plantsRes.data.data.map((p: Plant) => ({
                _id: p._id,
                name: p.name,
              }))
            : plantsRes.data.map((p: Plant) => ({
                _id: p._id,
                name: p.name,
              }))
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch tasks or plants.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddTask = async () => {
    if (!taskName || !plantName)
      return toast.error("Please fill out both task and plant name.");

    const user_id = localStorage.getItem("_id");
    if (!user_id) return toast.error("User not found.");

    try {
      setIsAdding(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/task/createNewTask`,
        { user_id, name: taskName, plant_name: plantName },
        {
          headers: { Authorization: localStorage.getItem("token") },
          withCredentials: true,
        }
      );

      setTasks((prev) => [...prev, res.data]);
      setTaskName("");
      setPlantName("");
      toast.success("Task added successfully 🌿");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create task.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/task/deleteTask/${taskId}`,
        {
          headers: { Authorization: localStorage.getItem("token") },
          withCredentials: true,
        }
      );
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success("Task marked as done ✅");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete task.");
    }
  };

  return (
    <div className="px-6 py-10 bg-gray-50 min-h-screen overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Tasks
        </h1>
      </div>

      {/* Add Task Section */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SiTask className="text-green-600 opacity-80" />
          <Input
            placeholder="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full sm:w-64"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <PiPlant className="text-green-600 opacity-80" />
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-between gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-600 w-full sm:w-52">
              <FaCaretDown /> {plantName || "Select Plant"}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-lg shadow-lg border border-gray-100">
              {plants.length > 0 ? (
                plants.map((p) => (
                  <DropdownMenuItem
                    key={p._id}
                    onSelect={() => setPlantName(p.name)}
                  >
                    {p.name}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="text-xs text-gray-500 px-3 py-2">
                  No plants found.
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Button
          onClick={handleAddTask}
          disabled={isAdding}
          className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto transition-all"
        >
          {isAdding ? "Adding..." : "Add Task"}
        </Button>
      </div>

      {/* Task List */}
      <div className="mt-8 space-y-3">
        {isLoading ? (
          <div className="text-center text-gray-500 py-10 animate-pulse">
            Loading your tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No pending tasks you’re all caught up! 🌱
          </div>
        ) : (
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="flex justify-between items-center bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{task.name}</h3>
                  <p className="text-sm text-gray-500">{task.plant_name}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="flex items-center gap-1 text-green-600 hover:text-green-700 transition-all"
                  >
                    <FaCheck size={16} />
                    <span className="text-sm font-medium hidden sm:inline">
                      Done
                    </span>
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-gray-400 hover:text-red-500 transition-all"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Tasks;
