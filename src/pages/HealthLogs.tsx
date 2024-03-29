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

const HealthLogs = () => {

  const [logType, setLogType] = useState(null);
  const [newType, setNewType] = useState("");

  const [logName, setLogName] = useState("");
  const [relatedType, setRelatedType] = useState("");
  const [dateOfLog, setDateOfLog] = useState("");
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);

  const types  = [ "type 1" , "type 2" , "type 3"]

  const handleAddType = async () => {
    const newLogType = [...types, newType];
    console.log(newLogType)
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0] as unknown as null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const data = {
      user_id : localStorage.getItem("_id"),
      image : file,
      type : relatedType,
      dateOfLog : dateOfLog,
      comment : comment,
      name : logName
    }
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
          {types.map((type, index) => (
                  <DropdownMenuItem key={index} onSelect={() => setLogType(type)}>
                    {type}
                  </DropdownMenuItem>
                ))}
          <DropdownMenuItem onSelect={() => setLogType(null)}>All Logs</DropdownMenuItem>
          <DropdownMenu >
            <Dialog>
                    <DialogTrigger>+Add Type</DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Add a new Type
                        </DialogTitle>
                      </DialogHeader>
                      <Input type="text" value={newType} onChange={(e) => setNewType(e.target.value)} />
                      <Button onClick={handleAddType}>Submit</Button>
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
                  + Create Log
                </Button>
              </DialogTrigger>
              <DialogContent className="font-semibold">
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
                      {types.map((type, index) => (
                        <DropdownMenuItem key={index} onSelect={() => setRelatedType(type)}>
                          {type}
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
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthLogs