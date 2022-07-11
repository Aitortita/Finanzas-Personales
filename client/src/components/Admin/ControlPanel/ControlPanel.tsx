import styles from "./ControlPanel.module.css"
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from "redux/hooks"
import getAllUsers from "redux/reducers/adminReducer/Actions/getAllUsers"
import Nav from "components/Nav/Nav"
import UserRow from "./utils/allUsersChart/UserRow"
import InfoChart from "./utils/InfoChart/InfoChart"
import getAllReports from "redux/reducers/adminReducer/Actions/getAllReports"

export default function ControlPanel() {
const dispatch = useAppDispatch()
const {allUsers, allReports} = useAppSelector(({admin}) => admin)

  useEffect(()=>{
    dispatch(getAllUsers())
    dispatch(getAllReports())
  },[])

  return (
    <div className={styles.wrapper}>
      <Nav />
      <div className={styles.pannelWrapper}>
        <div className={styles.topPannelWrapper}>
          <div style={{display: "grid", gridTemplateRows: "min-content 1fr", paddingTop: "5px"}}>
            <h3>Estadisticas de usuarios registrados: </h3>
            <div className={styles.graphContainer}>
              <InfoChart data={allUsers.map(user => user?.createdAt?.toString().substring(0, 10)).filter(e => e !== undefined)}/>
            </div>
          </div>
          <div style={{display: "grid", gridTemplateRows: "min-content 1fr"}}>
            <h3>Reviews reportados: </h3>
            <table style={{backgroundColor: "#444444", width: "100%", height: "100%"}}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Reports</th>
                </tr>
              </thead>
              <tbody>
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.bottomPannelWrapper}>
          <table className={styles.table2}>
            <thead>
              <tr className={styles.tr}>
                <th>Nombre</th>
                <th>Email</th>
                <th>Role</th>
                <th>Premium</th>
              </tr>
            </thead>
            <tbody>
            {
              allUsers.map(user => <UserRow
                key={user._id}
                id={user._id}
                email={user.email}
                nombre={user.firstName}
                apellido={user.lastName}
                role={user.role}
                premium={user.premium}
                />)
            }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

