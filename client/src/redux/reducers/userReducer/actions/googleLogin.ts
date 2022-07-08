import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"


export const googleLogin: any = createAsyncThunk("user/googleLogin",
async (jwt) => {
  const { data } = await axios.post("/user/googleLogin", { jwt: jwt })
  localStorage.setItem("logged", "true")
  return data
})