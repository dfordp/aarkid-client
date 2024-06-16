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
import { useRecoilValue } from "recoil"
import { User,UserI } from "@/atom"
import PlantCard from "@/components/elements/PlantCard"
import { FaSpinner } from 'react-icons/fa';
import toast from "react-hot-toast"


interface Plant {
  species: string;
  name: string;
  image: string;
  dateOfPlanting: string;
  comment: string;
  _id: string;
}

const Plants = () => {
  const [plantSpecies,setPlantSpecies] = useState<string | null>(null);
  const [newSpecies, setNewSpecies] = useState("");
  const [plants,setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [plantName, setplantName] = useState("");
  const [relatedSpecies, setRelatedSpecies] = useState("");
  const [dateOfPlantation, setDateOfPlantation] = useState("");
  const [comment, setcomment] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [species , setSpecies] = useState<string[]>([]);
  const user = useRecoilValue<UserI | null>(User);

  useEffect(()=>{
    setIsLoading(true);

    if (user && user.plantSpecies) {
      setSpecies(user.plantSpecies);
    }
    setIsLoading(true);

    const fetchPlants = async () => {
      const _id = localStorage.getItem("_id")

      const plants = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/plant/getPlantsByUserId/${_id}`,{
        headers: {
          'Authorization': localStorage.getItem("token"),
        },
        withCredentials: true
      });

      console.log(plants.data);
      setPlants(plants.data)
      setIsLoading(false);
    }

    fetchPlants();

  },[user])

  const filteredPlants = plantSpecies ? plants.filter(plant => plant.species === plantSpecies) : plants;

  const handleAddSpecies = async () => {
    const newplantSpecies = [...species,newSpecies];
    console.log(newplantSpecies)

    const id = localStorage.getItem("_id");

    const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/user/updateUser/${id}`, {plantSpecies : newplantSpecies}  , {
      headers: {
        'Authorization': localStorage.getItem("token"),
      },
      withCredentials: true
    });

    toast.success("New species added successfully")

    console.log(res.data);
    setSpecies(newplantSpecies);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0] as unknown as null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = localStorage.getItem("token")
    const data = {
      user_id : localStorage.getItem("_id"),
      image : file,
      species : relatedSpecies,
      dateOfPlanting : dateOfPlantation,
      comment : comment,
      name : plantName
    }

    console.log(data);
    console.log(token);
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/plant/createNewPlant`, data, {
        headers: {
          'Authorization': token,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
      console.log(res);
      toast.success("New Plant Added Successfully")
      setplantName("");
      setRelatedSpecies("");
      setDateOfPlantation("");
      setcomment("");
      setFile(null);
  }

  return (
    <div className="px-4 py-4 " style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <FaSpinner className="animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex flex-row justify-between">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">
              Plants
            </h1>
            <div className="my-2 gap-2 flex flex-row">
            <div className="bg-black text-white px-4 rounded-md">
              <DropdownMenu>
              <DropdownMenuTrigger className="flex flex-row items-center gap-3 py-2"><FaCaretDown /> <div>{plantSpecies || "All Plants"}</div></DropdownMenuTrigger>
              <DropdownMenuContent>
              {species.map((species, index) => (
                      <DropdownMenuItem key={index} onSelect={() => setPlantSpecies(species)}>
                        {species}
                      </DropdownMenuItem>
                    ))}
              <DropdownMenuItem onSelect={() => setPlantSpecies(null)}>All Plants</DropdownMenuItem>
              <DropdownMenu >
                <Dialog>
                        <DialogTrigger>+Add Species</DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              Add a new Species
                            </DialogTitle>
                          </DialogHeader>
                          <Input type="text" value={newSpecies} onChange={(e) => setNewSpecies(e.target.value)} />
                          <Button onClick={handleAddSpecies}>Submit</Button>
                        </DialogContent>
                      </Dialog>
              </DropdownMenu>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
            <div>
                <Dialog>
                  <DialogTrigger>
                    <Button>
                      + Create Plant
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="font-semibold">
                    <DialogHeader>
                      <DialogTitle className="text-3xl font-bold">Create Plant</DialogTitle>
                    </DialogHeader>

                    <label>
                      Plant Name:
                      <Input value={plantName} onChange={e => setplantName(e.target.value)} />
                    </label>

                    <label>
                      Species:
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex flex-row items-center gap-3 py-2"><FaCaretDown /> <div>{relatedSpecies || "Select Species"}</div></DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {species.map((issue, index) => (
                            <DropdownMenuItem key={index} onSelect={() => setRelatedSpecies(issue)}>
                              {issue}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </label>

                    <label>
                      Date of Plantation:
                      <Input type="date" value={dateOfPlantation} onChange={e => setDateOfPlantation(e.target.value)} />
                    </label>

                    <label>
                      Comments (if any):
                      <Input className="my-2" value={comment} onChange={e => setcomment(e.target.value)} />
                    </label>

                    <label>
                      Image:
                      <Input type="file" className='w-full my-2' onChange={handleFileChange} />
                    </label>

                    <Button onClick={handleSubmit}>
                      Submit
                    </Button>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <div className="mt-6 mx-8 grid grid-cols-3 gap-6 overflow-y-auto" style={{ maxHeight: '400px' }}>
            {filteredPlants.map((plant,index)=>(
              <PlantCard key={index}
                plantName = {plant.name}
                plantimage = {plant.image}
                species = {plant.species}
                plantDop = {plant.dateOfPlanting}
                plantcomment = {plant.comment}
                plantId = {plant._id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Plants