import { atom } from "recoil";

export const Authenticated = atom({
    key: "Authenticated",
    default: false  
}); 

export const User = atom({
    key : "User",
    default : {}
})