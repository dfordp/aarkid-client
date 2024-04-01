import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import HealthLogCard from "@/components/elements/HealthLogCard";

interface Plant {
  dateOfPlanting: string;
  image: string;
  name: string;
  species: string;
  comment: string;
}

interface HealthLog {
  attachment: string;
  name: string;
  _id: string;
  dateOfDiagnosis: string;
  comment: string;
}

const Plant = () => {
  const [plant, setPlant] = useState<Plant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const [logs, setLogs] = useState<HealthLog[]>([]);

  useEffect(() => {
    const parts = location.pathname.split("/");
    const _id = parts[parts.length - 1];

    const fetchPlant = async () => {
      const plantdata = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/plant/getPlant/${_id}`, {
        headers: {
          'Authorization': localStorage.getItem("token"),
        },
        withCredentials: true,
      });

      setPlant(plantdata.data);
      setIsLoading(false);
    }

    const fetchLogs = async () => {
      const logs = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/healthlog/getHealthLogsByPlantId/${_id}`,{
        headers: {
          'Authorization': localStorage.getItem("token"),
        },
        withCredentials: true
      });
      
      setLogs(logs.data);
    }
    
    fetchLogs();
    fetchPlant();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const date = new Date(plant!.dateOfPlanting);
  const formattedDate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;

  return (
    <div className="px-4 py-4 " style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <div className="flex flex-row justify-between">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">
          Plant
        </h1>
      </div>
      <div className="pt-16 px-4 flex flex-row gap-4">
        <div>
          <img src={plant!.image} className="w-48 h-48 rounded-full"/>
        </div>
        <div className="font-semibold flex flex-col">
          <div className="flex flex-row gap-10">
            <label>
              Plant Name:
              <Input disabled className="my-2 w-80" value={plant!.name} />
            </label>
            <label>
              Species:
              <Input disabled className="my-2 w-80" value={plant!.species} />
            </label>
          </div>
          <div className="flex flex-row gap-10">
            <label>
              Date of Planting:
              <Input disabled className="my-2 w-80" value={formattedDate} />
            </label>
            <label>
              Comment:
              <Input disabled className="my-2 w-80" value={plant!.comment} />
            </label>
          </div>
        </div>
      </div>
      <div>
        <h1 className="scroll-m-20 text-2xl mt-4 ml-2 font-bold tracking-tight">
          HealthLogs
        </h1>
      </div>
      <div className="mt-6 mx-8 grid grid-cols-3 gap-6 overflow-y-auto" style={{ maxHeight: '400px' }}>
        {logs.map((healthLog, index: number) => (
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

export default Plant;