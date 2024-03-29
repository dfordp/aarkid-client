import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useState } from "react"
import { FaCaretDown } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Plants = () => {

  const [plantSpecies,setPlantSpecies] = useState(null);
  const [newSpecies, setNewSpecies] = useState("");

  const [plantName, setplantName] = useState("");
  const [relatedSpecies, setRelatedSpecies] = useState("");
  const [dateOfPlantation, setDateOfPlantation] = useState("");
  const [comment, setcomment] = useState("");
  const [file, setFile] = useState(null);


  const species  = [ "species 1" , "species 2" , "species 3"]

  const handleAddIssue = async () => {

    const newplantSpecies = [...species,newSpecies];
    console.log(newplantSpecies)

    // const id = localStorage.getItem("_id");

    // const res = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/user/updateUser/${id}`, {issues : newIssues}  , {
    //   headers: {
    //     'Authorization': localStorage.getItem("token"),
    //   },
    //   withCredentials: true
    // });

    // console.log(res.data);
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

    // console.log(data);
    // console.log(token);
    //   // import.meta.env.VITE_BACKEND_URL}/api/record/createRecord
    //   const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/record/createRecord`, data, {
    //     headers: {
    //       'Authorization': token,
    //       'Content-Type': 'multipart/form-data'
    //     },
    //     withCredentials: true
    //   });
    //   console.log(res);

    //   setRecordName("");
    //   setRelatedIssue("");
    //   setDateOfCreation("");
    //   setDoctorName("");
    //   setFiles(null);
  }  


  return (
    <div className="px-4 py-4 " style={{ maxHeight: '100vh', overflowY: 'auto' }}>
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
          <DropdownMenuItem onSelect={() => setPlantSpecies(null)}>All Records</DropdownMenuItem>
          <DropdownMenu >
            <Dialog>
                    <DialogTrigger>+Add Issue</DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Add a new Species
                        </DialogTitle>
                      </DialogHeader>
                      <Input type="text" value={newSpecies} onChange={(e) => setNewSpecies(e.target.value)} />
                      <Button onClick={handleAddIssue}>Submit</Button>
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
    </div>
  )
}

export default Plants
