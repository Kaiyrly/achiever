import React from 'react'
import { Outlet } from 'react-router-dom'

export const Layout = () => {
  return (
    <div style={{marginTop: "2rem"}}>
      <Outlet/>
    </div>
  )
}
