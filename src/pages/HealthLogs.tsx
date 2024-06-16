import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useEffect, useState } from "react"
import { FaCaretDown } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"
import HealthLogCard from "@/components/elements/HealthLogCard"
import toast from "react-hot-toast"

interface Plant {
  _id: string;
  name: string;
}

interface HealthLog {
  _id: string;
  name: string;
  attachment: string;
  dateOfDiagnosis: string;
  comment: string;
  plant_id: string;
}

const HealthLogs = () => {

  const [logType, setLogType] = useState<string | null>(null);

  const [logName, setLogName] = useState("");
  const [relatedType, setRelatedType] = useState("");
  const [dateOfLog, setDateOfLog] = useState("");
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [healthLogBox,setHealthLogBox] = useState(false);
  const [logResult,setLogResult] = useState("");
  const [types,setTypes] = useState<Plant[]>([]);
  const [healthLogs,setHealthLogs]= useState<HealthLog[]>([]); 
  const [logTypeId,setLogypeId] = useState("");

  useEffect(()=>{

    const fetchHealthLogs = async () => {
      const _id = localStorage.getItem("_id");

      const logs = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/healthLog/getHealthLogsByUserId/${_id}`,{
        headers: {
          'Authorization': localStorage.getItem("token"),
        },
        withCredentials: true
      });
      console.log("logs",logs.data);
      
      setHealthLogs(logs.data);
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
      const plantNames = plants.data.map((plant: Plant) => ({_id: plant._id, name: plant.name}));
      console.log(plantNames);
      setTypes(plantNames)
    }

    fetchPlants();
    fetchHealthLogs();
  },[]);

  const filteredLogs = logType ? healthLogs.filter((log: HealthLog) => log.plant_id === logTypeId) : healthLogs;


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0] as unknown as null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const data = {
      user_id : localStorage.getItem("_id"),
      attachment : file,
      plant_id : relatedType,
      dateOfDiagnosis : dateOfLog,
      comment : comment,
      name : logName
    }
    console.log(data);
    
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/healthlog/createNewHealthLog/`,data,{
      headers: {
        'Authorization': localStorage.getItem("token"),
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });
    console.log(res.data);
    
    setHealthLogBox(true);
    setLogResult(res.data.diagnosisByModel)
    toast.success("Log Created Successfully")
  }  


  const handleSaveClick = () => {
    setLogName("");
    setRelatedType("");
    setDateOfLog("");
    setFile(null);
    setComment("");
    setLogResult("");
    setHealthLogBox(false);
    toast.success("Log Saved Successfully")
  }

  

  return (
    <div className="px-4 py-4 " style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <div className="flex flex-row justify-between">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">
          HealthLogs
        </h1>
        <div className="my-2 gap-2 flex flex-row">
        <div className="bg-black text-white px-4 rounded-md">
          <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-row items-center gap-3 py-2"><FaCaretDown /> <div>{logType || "All Logs"}</div></DropdownMenuTrigger>
          <DropdownMenuContent>
          {types.map((type: Plant, index) => (
                  <DropdownMenuItem key={index} onSelect={() =>{ setLogType(type.name); setLogypeId(type._id)}}>
                    {type.name}
                  </DropdownMenuItem>
                ))}
          <DropdownMenuItem onSelect={() => setLogType(null)}>All Logs</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
        <div>
            <Dialog>
              <DialogTrigger>
                <Button>
                  + Create Log
                </Button>
              </DialogTrigger>
              <DialogContent className="font-semibold h-[60vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold">Create Log</DialogTitle>
                </DialogHeader>

                <label>
                  Log Name:
                  <Input value={logName} onChange={e => setLogName(e.target.value)} />
                </label>

                <label>
                  Plant Name:
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex flex-row items-center gap-3 py-2"><FaCaretDown /> <div>{relatedType || "Select Type"}</div></DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {types.map((type: Plant, index) => (
                        <DropdownMenuItem key={index} onSelect={() => setRelatedType(type._id)}>
                          {type.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </label>

                <label>
                  Date of Log:
                  <Input type="date" value={dateOfLog} onChange={e => setDateOfLog(e.target.value)} />
                </label>

                <label>
                  Comments (if any):
                  <Input className="my-2" value={comment} onChange={e => setComment(e.target.value)} />
                </label>

                <label>
                  Image:
                  <Input type="file" className='w-full my-2' onChange={handleFileChange} />
                </label>

                <Button onClick={handleSubmit}>
                  Submit
                </Button>
                {healthLogBox && (
                  <div className="flex flex-col gap-6">
                     <label>
                      <h1 className="font-semibold">
                        Log Result
                      </h1>
                      <div>
                        <textarea disabled placeholder="Log Result" value={logResult} className="w-full h-40 mt-2"/>
                      </div>
                     </label>
                     <Button onClick={handleSaveClick}>
                        Save
                     </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <div className="mt-6 mx-8 grid grid-cols-3 gap-6 overflow-y-auto" style={{ maxHeight: '400px' }}>
            {(filteredLogs).map((healthLog: HealthLog, index: number) => (
                <div key={index}>
                  <HealthLogCard
                  image={healthLog.attachment} 
                  name={healthLog.name}
                  _id = {healthLog._id}
                  dateofDiagnosis = {healthLog.dateOfDiagnosis}
                  comment = {healthLog.comment}
                  />
                </div>
            ))}
          </div>
    </div>
  )
}

export default HealthLogs