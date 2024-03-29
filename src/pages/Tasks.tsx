import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SiTask } from "react-icons/si";
import { PiPlant } from "react-icons/pi";
import { CiCalendarDate } from "react-icons/ci";
import { FaCheck, FaTrash } from "react-icons/fa";

const Tasks = () => {

  const [taskName, setTaskName] = useState("");
  const [plantName, setPlantName] = useState("");
  const [date, setDate] = useState("");
  const [tasks, setTasks] = useState([
    { id: 1, taskName: "Water the plants", plantName: "Rose", date: "2022-01-01" },
    { id: 2, taskName: "Prune the plants", plantName: "Tulip", date: "2022-01-02" },
    // Add more tasks as needed
  ]);

  const handleAddTask = () => {
    // Create a new task object
    const newTask = {
      id: tasks.length + 1, // This is a simple way to generate a unique id
      taskName: taskName,
      plantName: plantName,
      date: date
    };
  
    // Add the new task to the tasks state
    setTasks([...tasks, newTask]);
  
    // Clear the input fields
    setTaskName("");
    setPlantName("");
    setDate("");
  };
  
  const handleCheck = (taskId) => {
    // Map over the tasks and for each task, if the task id matches the checked task id, add a 'checked' property to it
    const updatedTasks = tasks.map(task => task.id === taskId ? {...task, checked: !task.checked} : task);
  
    // Update the tasks state
    setTasks(updatedTasks);
  };
  
  const handleDelete = (taskId) => {
    // Filter out the task with the matching id
    const updatedTasks = tasks.filter(task => task.id !== taskId);
  
    // Update the tasks state
    setTasks(updatedTasks);
  };
  
  return (
    <div className="px-4 py-4 " style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <div className="flex flex-row justify-between">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">
          Tasks
        </h1>
      </div>
      <div className="mt-4 px-6 flex flex-row justify-center bg-slate-100 h-16 rounded-md shadow-md">
        <div className="flex flex-row justify-between w-full items-center">
          <div className="flex flex-row gap-2 items-center">
            <SiTask/>
            <Input className="w-64" placeholder="Task Name" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <PiPlant/>
            <Input className="w-64" placeholder="Plant Name" value={plantName} onChange={(e) => setPlantName(e.target.value)} />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <CiCalendarDate/>
            <Input type="date" className="w-64" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Button onClick={handleAddTask}>Add Task</Button>
          </div>
        </div>
      </div>
      <div className="mt-4">
        {tasks.map((task) => (
          <div key={task.id} className="flex justify-between items-center p-4 bg-slate-100 rounded-md shadow-md mb-4">
            <div>
              <h2 className="font-bold">{task.taskName}</h2>
              <p>{task.plantName}</p>
              <p>{task.date}</p>
            </div>
            <div className="flex gap-2">
              <FaCheck onClick={() => handleCheck(task.id)} />
              <FaTrash onClick={() => handleDelete(task.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tasks;