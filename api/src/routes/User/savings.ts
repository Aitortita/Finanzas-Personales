import { Router, Request, Response } from "express";
import User from "../../models/User";


const router = Router()

router.post("/", async (req: Request, res: Response) => {
  const {id, value} = req.body

  try{
    const user = await User.findById(id)
   if(!user){
    res.status(404).send(`No se encontró al usuario con id: ${id}`)
   } else {
    user.Saving.push(value)
    await user.save()
    res.status(200).send(user)
   }
  }
  catch (err) {
    res.status(400).send(err)
  }

});

export default router