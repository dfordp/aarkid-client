import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SiTask } from "react-icons/si";
import { PiPlant } from "react-icons/pi";
import { FaCaretDown, FaCheck, FaTrash } from "react-icons/fa";
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Tasks = () => {

  const [taskName, setTaskName] = useState("");
  const [plantName, setPlantName] = useState("");
  const [plantId,setPlantId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [plants ,setPlants] = useState([]);


  useEffect(()=>{

    const fetchTasks = async () => {
      const _id = localStorage.getItem("_id");

      const logs = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/task/getTasksByUserId/${_id}`,{
        headers: {
          'Authorization': localStorage.getItem("token"),
        },
        withCredentials: true
      });
      console.log("tasks",logs.data);
      
      const incompleteTasks = logs.data.filter(task => task.isCompleted === false);
      setTasks(incompleteTasks);
    }


    const fetchPlants =async () => {
      const _id = localStorage.getItem("_id")

      const plants = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/plant/getPlantsByUserId/${_id}`,{
        headers: {
          'Authorization': localStorage.getItem("token"),
        },
        withCredentials: true
      });
      console.log(plants.data);
      const plantNames = plants.data.map(plant => ({_id: plant._id, name: plant.name}));
      console.log(plantNames);
      setPlants(plantNames)
    }

    fetchPlants();
    fetchTasks();
  },[]);



  const handleAddTask = async () => {
    // Create a new task object
    const data = {
      user_id : localStorage.getItem("_id"),
      name: taskName,
      plant_name: plantName,
    };
    

    console.log(data);
    

    const newTask = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/task/createNewTask`,data,{
      headers: {
        'Authorization': localStorage.getItem("token"),
      },
      withCredentials: true
    });

    console.log(newTask.data);

    setTasks(...tasks,newTask.data);
    
    setTaskName("");
    setPlantName("");
  };
  
  const handleCheck = async (taskId) => {

    const data = {
      isCompleted : true
    }

    const newTask = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/task/updateTask/${taskId}`,data,{
      headers: {
        'Authorization': localStorage.getItem("token"),
      },
      withCredentials: true
    });

    const updatedTasks = tasks.filter(task => task._id !== taskId);
  
    setTasks(updatedTasks);
  };
  
  const handleDelete = async (taskId) => {

    const newTask = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/task/deleteTask/${taskId}`,{
      headers: {
        'Authorization': localStorage.getItem("token"),
      },
      withCredentials: true
    });

    // Filter out the task with the matching id
    const updatedTasks = tasks.filter(task => task._id !== taskId);
  
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
            {/* <Input className="w-64" placeholder="Plant Name" value={plantName} onChange={(e) => setPlantName(e.target.value)} /> */}
            <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-row items-center gap-3 py-2"><FaCaretDown /> <div>{plantName}</div></DropdownMenuTrigger>
          <DropdownMenuContent>
            {plants.map((type, index) => (
                    <DropdownMenuItem key={index} onSelect={() => {setPlantName(type.name); setPlantId(type._id)}}>
                      {type.name}
                    </DropdownMenuItem>
                  ))}
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
          <div>
            <Button onClick={handleAddTask}>Add Task</Button>
          </div>
        </div>
      </div>
      <div className="mt-4">
        {tasks.map((task) => (
          <div key={task._id} className="flex justify-between items-center p-4 bg-slate-100 rounded-md shadow-md mb-4">
            <div>
              <h2 className="font-bold">{task.name}</h2>
              <p>{task.plant_name}</p>
            </div>
            <div className="flex gap-2">
              <FaCheck onClick={() => handleCheck(task._id)} />
              <FaTrash onClick={() => handleDelete(task._id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Tasks;