import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth/Auth'
import Profile from './pages/profile/Profile'
import Chat from './pages/chat/Chat'
import { useAppStore } from './store'
import axiosClient from './lib/axios-client'
import { GET_USER_INFO } from './utils/constants'

const PrivateRoute = ({children}) => {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth"/>;
}

const AuthRoute = ({children}) => {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat"/> : children;
}

const App = () => {

  const {userInfo,setUserInfo} = useAppStore();
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {

      try {
        const response = await axiosClient.get(GET_USER_INFO,{
          withCredentials:true
        });
        if(response.data.success){
          setUserInfo(response.data.user);
        }
        else{
          setUserInfo(undefined);
        }
      } catch (error) {
        setUserInfo(undefined);
      } finally {
        setloading(false);
      }
      
    }
    if(!userInfo){
      getUserData();
    }
    else{
      setloading(false);
    }
  }, [userInfo,setUserInfo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Routes>
        <Route path='/auth' element={<AuthRoute><Auth /></AuthRoute>} />
        <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path='/chat' element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path='*' element={<Navigate to="/auth" />} />
      </Routes>
    </div>
  )
}

export default App;
