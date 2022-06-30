import { Router, Request, Response } from "express";
import User from "../../models/User";
import bcrypt from 'bcrypt'
import Joi from 'joi';


const schema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required()
})


const router = Router()


router.post("/", async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const { error } = schema.validate(req.body)
    if(error) return res.status(400).send({message: error.details[0].message})
    const userExistCheck = await User.findOne({email})
    if (userExistCheck) return res.status(400).send('Email ya registrado')
    const salt = await bcrypt.genSalt(Number(process.env.SUPER_SECRET_SALT))
    const hashPass = await bcrypt.hash(password, salt)
    const user = await User.create({userName: firstName, lastName, email, password: hashPass})
    const {avatar, Account, Saving, premium, CategoriesExpenses, CategoriesInputs} = user
    const token = user.generateAuthToken()
    res.cookie("access_token", token, {maxAge : 7 * 24 * 3600 * 1000, httpOnly: true}).status(201).send({userName: firstName, lastName, email, avatar, Account, Saving, premium, CategoriesExpenses, CategoriesInputs})
  } catch (err: any) {
    res.status(400).send(err.message)
  }
})

export default router