import { useEffect, useState } from "react";
import { IoIosSend, IoIosImage } from "react-icons/io";
import BotPic from "../assets/chatbotpic.jpg"
import { Input } from "@/components/ui/input";
import { useRecoilValue } from "recoil";
import { User } from "@/atom";
import axios from "axios";
import ReactMarkdown from 'react-markdown';

const Chat = () => {
  const [message, setMessage] = useState("")
  const [file,setfile] = useState(null);
  const [messages,setMessages] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(()=>{
    const _id = localStorage.getItem("_id");

    const fetchMessages = async() => {
      const messages = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/message/getMessagesByUserId/${_id}`,{
        headers: {
          'Authorization': localStorage.getItem("token"),
        },
        withCredentials: true
      });
      console.log("messages",messages.data);
      
      const filteredMessages = messages.data.filter(message => {
        const messageDate = new Date(message.createdAt);
        return messageDate.getFullYear() === selectedDate.getFullYear() &&
          messageDate.getMonth() === selectedDate.getMonth() &&
          messageDate.getDate() === selectedDate.getDate();
      });

      filteredMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      setMessages(filteredMessages);
    }

    fetchMessages();
  },[selectedDate]);

  const user = useRecoilValue(User);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setfile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const data = {
      user_id: localStorage.getItem("_id"),
      sent_By: "user",
      message_content: message,
    }

    const ndata = {
      user_id: localStorage.getItem("_id"),
      sent_By: "user",
      message_content: message,
      createdAt: new Date().toISOString(),
    }

    setMessages([...messages,  ndata ]);
    setMessage("");

    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/message/createNewMessage`,data,{
      headers: {
        'Authorization': localStorage.getItem("token"),
      },
      withCredentials: true
    });
    console.log(res.data);
    setMessages([...messages,ndata,res.data])
  }

  // Group messages by date
  const messagesByDate = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="flex flex-col h-[100vh] overflow-auto bg-gray-200 p-4">
      {Object.entries(messagesByDate).map(([date, messages]) => (
        <div key={date}>
          <div className="flex justify-center">
            <div className="bg-gray-300 rounded-md text-xs text-gray-600 py-1 px-2">{date}</div>
          </div>
          {messages.map((message, index) => (
            message.sent_By === 'user' ?
              <div key={index} className="chat-message flex flex-col items-end">
                <img className="h-7 w-7 rounded-full mb-2" src={user.image} alt="Current user" />
                <div className="self-end bg-gray-400 p-2 rounded-md mx-4">
                  {message.message_content}
                  <div className="text-xs text-gray-600">{new Date(message.createdAt).toLocaleTimeString()}</div>
                </div>
              </div>
            :
              <div key={index} className="chat-message flex flex-col items-start">
                <img className="h-7 w-7 rounded-full mb-2" src={BotPic} alt="Other user" />
                <div className="self-start bg-gray-300 p-2 rounded-md mx-4 w-80">
                  <ReactMarkdown>{message.message_content}</ReactMarkdown>
                <div className="text-xs text-gray-600">{new Date(message.createdAt).toLocaleTimeString()}</div>
                </div>
              </div>
          ))}
        </div>
      ))}
      <div className="mt-4 flex-none">
        <div className="border-t-2 border-gray-300 pt-4 flex items-center">
          <div className="input-icon-container">
              <Input type="file"  className="w-10 p-2 rounded-lg bg-white shadow hover:bg-gray-200"  onChange={handleFileChange} />
              <IoIosImage size={24} className="input-icon" />
          </div>
          <Input 
            className="ml-2 flex-grow border-2 rounded-lg p-2" 
            type="text" 
            placeholder="Type a message" 
            value={message} 
            onChange={e => setMessage(e.target.value)}
          />
          <button onClick={handleSubmit} className="ml-2 p-2 rounded-lg bg-white shadow hover:bg-gray-200">
            <IoIosSend size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;