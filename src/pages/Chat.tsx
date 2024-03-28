import { useState } from "react";
import { IoIosSend, IoIosImage } from "react-icons/io";
import BotPic from "../assets/chatbotpic.jpg"
import { Input } from "@/components/ui/input";

const Chat = () => {
  const [message, setMessage] = useState('');

  // Get current date and time
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();

  return (
    <div className="flex flex-col h-[100vh] bg-gray-200 p-4">
      <div className="flex justify-center">
        <div className="bg-gray-300 rounded-md text-xs text-gray-600 py-1 px-2">{date}</div>
      </div>
      <div className="flex-grow overflow-auto">
        <div className="flex flex-col gap-4">
          <div className="chat-message flex flex-col items-start">
            <img className="h-7 w-7 rounded-full mb-2" src={BotPic} alt="Other user" />
            <div className="self-start bg-gray-300 p-2 rounded-md mx-4">
              Other user's message
              <div className="text-xs text-gray-600">{time}</div>
            </div>
          </div>
          <div className="chat-message flex flex-col items-end">
            <img className="h-7 w-7 rounded-full mb-2" src="https://avatars.githubusercontent.com/u/92905896?v=4" alt="Current user" />
            <div className="self-end bg-gray-400 p-2 rounded-md mx-4">
              Your message
              <div className="text-xs text-gray-600">{time}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex-none">
        <div className="border-t-2 border-gray-300 pt-4 flex items-center">
          {/* <button className="p-2 rounded-lg bg-white shadow hover:bg-gray-200">
            <IoIosImage size={24} />
          </button> */}
          <div className="input-icon-container">
              <Input type="file" className="w-10 p-2 rounded-lg bg-white shadow hover:bg-gray-200" />
              <IoIosImage size={24} className="input-icon" />
          </div>
          <Input 
            className="ml-2 flex-grow border-2 rounded-lg p-2" 
            type="text" 
            placeholder="Type a message" 
            value={message} 
            onChange={e => setMessage(e.target.value)}
          />
          <button className="ml-2 p-2 rounded-lg bg-white shadow hover:bg-gray-200">
            <IoIosSend size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;