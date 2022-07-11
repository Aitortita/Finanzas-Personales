import styles from "./Review.module.css"
import imagePlaceholder from "assets/imagePlaceholder.jpg"
import { Rating } from "@mui/material"
import { useNavigate } from "react-router-dom"
export interface userReview {
  user: {
    id: string
    avatar: string
    text : string
    firstName: string
    review : { 
      text: string
      rating: number
    }
  }
}

export default function Review({user, setMenuPreview, reported}: any) {
  const navigate = useNavigate()
  return (
    <div className={styles.wrapper}>
      {user ? 
      <>
      <div>
      <img src={user.avatar ? user.avatar : imagePlaceholder} className={styles.img} referrerPolicy="no-referrer"/>
      </div>
      <div className={styles.reviewWrapper}>
        <h4 style={{color: "#848282", overflowWrap: "anywhere"}}>"{user?.review?.text}"</h4>
        <div>
        <h2 style={{color: "#6B6666"}}>{user?.firstName}</h2>
        <Rating value={user?.review?.rating || 0} readOnly/>
        </div>
      </div>
      {localStorage.getItem("logged") ?
        <button className={styles.reportButton} onClick={() => setMenuPreview((prev : any) => !prev)}><span className="material-icons">report</span></button>
        :
        <button className={styles.reportButton} onClick={() => navigate("/login")}><span className="material-icons">report</span></button>
      }
      </>
      : <h1 style={{color: "black", fontSize: "2rem"}}>There are currently no reviews</h1>
      }
    </div>
  )
}

