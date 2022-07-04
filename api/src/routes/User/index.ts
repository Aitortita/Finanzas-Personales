import { Router } from "express";
const router = Router()
import register from './register'
import login from './login'
import googleLogin from './googleLogin'
import logout from './logout'
import getUserInfo from './getUserInfo'
import accountAdd from './accountAdd'
import savings from './savings'
import userUpdate from './userUpdate'
import accountDelete from './accountDelete'
import deleteUser from './deleteUser'
import categoryAdd from './categoryAdd'
import categoryDelete from './categoryDelete'
import savingsDelete from './savingsDelete'

router.use('/login', login)
router.use('/googleLogin', googleLogin)
router.use('/logout', logout)
router.use('/getUserInfo', getUserInfo)
router.use('/account', accountAdd)
router.use('/category', categoryAdd)
router.use('/saving', savings)
router.use('/register', register)
router.use('/update', userUpdate)
router.use('/account', accountDelete)
router.use('/category', categoryDelete)
router.use('/delete', deleteUser)

export default router