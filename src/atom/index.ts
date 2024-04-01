import { atom } from "recoil";

export const Authenticated = atom({
    key: "Authenticated",
    default: false  
}); 

export interface UserI {
  createdAt: string;
  email: string;
  image: string;
  name: string;
  plantSpecies: string[];
  updatedAt: string;
  __v: number;
  _id: string;
}

export const User = atom<UserI | null>({
    key : "User",
    default : null
});