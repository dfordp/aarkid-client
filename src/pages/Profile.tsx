import { User , UserI } from "@/atom";
import { Input } from "@/components/ui/input";
import { useRecoilValue } from "recoil";

const Profile = () => {
  const user = useRecoilValue<UserI | null>(User);

  if (!user) {
    return <div>Loading...</div>;
  }

  const date = new Date(user.createdAt);
  const formattedDate = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;

  return (
    <div className="px-4 py-4 " style={{ maxHeight: '100vh', overflowY: 'auto' }}>
      <div>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">
          Profile
        </h1>
      </div>
      <div className="pt-16 px-4 flex flex-row gap-4">
        <div>
          <img src={user.image} className="w-48 h-48 rounded-full"/>
        </div>
        <div className="font-semibold flex flex-col">
             <div className="flex flex-row gap-10">
                  <label>
                    User Name:
                    <Input disabled className="my-2 w-80" value={user.name} />
                  </label>
                  <label>
                    User Email:
                    <Input disabled  className="my-2 w-80" value={user.email}/>
                  </label>
             </div>
             <div className="flex flex-row gap-10">
                  <label>
                    User Since:
                    <Input disabled className="my-2 w-80" value={formattedDate}/>
                  </label>
                  <label>
                    User Plants:
                    <Input disabled  className="my-2 w-80" value={user.plantSpecies.join(', ')} />
                  </label>
             </div>
        </div>
      </div>
    </div>
  )
}

export default Profile