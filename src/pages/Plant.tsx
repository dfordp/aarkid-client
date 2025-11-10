import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import HealthLogCard from "@/components/elements/HealthLogCard";
import { motion } from "framer-motion";
import { FaLeaf } from "react-icons/fa";
import { IoIosCalendar } from "react-icons/io";
import { Button } from "@/components/ui/button";

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
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const id = location.pathname.split("/").pop();
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [plantRes, logsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/plant/getPlant/${id}`, {
            headers: { Authorization: localStorage.getItem("token") },
            withCredentials: true,
          }),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/healthlog/getHealthLogsByPlantId/${id}?page=${page}&limit=6`,
            {
              headers: { Authorization: localStorage.getItem("token") },
              withCredentials: true,
            }
          ),
        ]);

        setPlant(plantRes.data);
        setLogs(logsRes.data.data);
        setTotalPages(logsRes.data.totalPages);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [location.pathname, page]);

  if (isLoading || !plant) {
    return <div className="flex justify-center items-center h-[80vh] text-gray-600">Loading...</div>;
  }

  const formattedDate = new Date(plant.dateOfPlanting).toLocaleDateString();

  return (
    <div className="px-6 py-10 overflow-y-auto min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">{plant.name}</h1>
        <p className="text-gray-500 text-sm">Plant Overview & Health History</p>
      </div>

      {/* Overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row items-start gap-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <img
          src={plant.image}
          alt={plant.name}
          className="w-48 h-48 rounded-xl object-cover border border-gray-200 shadow-sm"
        />
        <div className="flex-1 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-gray-600">Plant Name</label>
              <Input disabled value={plant.name} className="mt-1 bg-gray-50 border-gray-200" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Species</label>
              <Input disabled value={plant.species} className="mt-1 bg-gray-50 border-gray-200" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Date of Planting</label>
              <Input disabled value={formattedDate} className="mt-1 bg-gray-50 border-gray-200" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Comment</label>
              <Input disabled value={plant.comment} className="mt-1 bg-gray-50 border-gray-200" />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <FaLeaf className="text-green-600" />
              <span className="text-sm">{plant.species}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <IoIosCalendar className="text-green-600" />
              <span className="text-sm">Planted on {formattedDate}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Health Logs */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Health Logs</h2>

        {logs.length === 0 ? (
          <p className="text-gray-500 italic text-sm">No health logs yet.</p>
        ) : (
          <>
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {logs.map((log) => (
                <HealthLogCard
                  key={log._id}
                  image={log.attachment}
                  name={log.name}
                  _id={log._id}
                  dateofDiagnosis={log.dateOfDiagnosis}
                  comment={log.comment}
                />
              ))}
            </motion.div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                Prev
              </Button>
              <span className="text-gray-600 text-sm font-medium">
                Page {page} of {totalPages}
              </span>
              <Button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                Next
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Plant;
