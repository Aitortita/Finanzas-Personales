import { Router, Request, Response } from "express";
import authorization from "../../middleware/authorization";
import User from "../../models/User";

const router = Router()

router.post("/", authorization, async (req: any, res: Response) => {
  const { key, value } = req.body
  try {
    const user: any = await User.findById(req.userId)
    if (!user) {
      res.status(404).send(`No se encontró al usuario con id: ${req.userId}`)
    } else {
      const {email, userName, lastName, avatar, Account, Saving, premium, CategoriesExpenses, CategoriesInputs} = user
      await user[key].push(value).save()
      res.status(200).send({email, userName, lastName, avatar, Account, Saving, premium, CategoriesExpenses, CategoriesInputs})
    }
  }
  catch (err) {
    res.status(400).send(err)
  }

});

export default router;