import { useState } from 'react'

// TODO: change token to user

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('user')
    return tokenString ? JSON.parse(tokenString)?.token : undefined
  }

  const [token, setToken] = useState<string | undefined>(getToken())

  const saveToken = (userToken: {token: string | undefined}) => {
    localStorage.setItem('user', JSON.stringify(userToken))
    setToken(userToken.token)
  }

  return {
    setToken: saveToken,
    token
  }
}