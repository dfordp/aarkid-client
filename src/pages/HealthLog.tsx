import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import ReactMarkdown from 'react-markdown';

interface Log {
  dateOfDiagnosis: string;
  attachment: string;
  name: string;
  comment: string;
  diagnosisByModel: string;
}

const HealthLog = () => {
  const [log, setLog] = useState<Log | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchLog = async () => {
      const parts = location.pathname.split("/");
      const _id = parts[parts.length - 1];

      const logData = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/healthlog/getHealthLog/${_id}`, {
        headers: {
          'Authorization': localStorage.getItem("token"),
        },
        withCredentials: true,
      });

      setLog(logData.data);
      setIsLoading(false);
    }

    fetchLog();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  let formattedDate = '';
  if (log && log.dateOfDiagnosis) {
    const date = new Date(log.dateOfDiagnosis);
    formattedDate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
  }


  return (
    <div className="px-4 py-4 " style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <div className="flex flex-row justify-between">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">
          Health Log
        </h1>
      </div>
      <div className="pt-16 px-4 flex flex-col gap-4">
        <div className="flex flex-row justify-center">
          <img src={log?.attachment} className="w-80 rounded-md"/>
        </div>
        <div className="font-semibold flex flex-col pl-20">
          <div className="flex flex-row gap-10">
            <label>
              Log Name:
              <Input disabled className="my-2 w-80" value={log?.name} />
            </label>
            <label>
              Date of Diagnosis:
              <Input disabled className="my-2 w-80" value={formattedDate} />
            </label>
          </div>
          <div className="flex flex-col gap-10">
            <label className="flex flex-col">
              Comment:
              <textarea disabled className="my-2 w-80" value={log?.comment} />
            </label>
            <label>
              Diagnosis By Model:
              <ReactMarkdown>{log?.diagnosisByModel}</ReactMarkdown>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthLog;