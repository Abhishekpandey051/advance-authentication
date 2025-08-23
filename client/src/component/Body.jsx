import React, { useEffect } from 'react'
import Header from './Header'
import { Outlet, useNavigate } from 'react-router-dom'
import { adduser } from '../store/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from '../constant'

function Body() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userData = useSelector((store) => store.user )
  const fetchUserProfile = async () => {
    try {
      if(userData) return;
      const res = await axios.get(BASE_URL + "/profile", {
        withCredentials: true,
      });
      dispatch(adduser(res.data?.data))
    } catch (err) {
      if(err.status === 401){
      navigate('/auth')
    }
      console.error(err.status);
    }
  };

  useEffect(() => {
    if(!userData){
      fetchUserProfile()
    }
  }, []);
  return (
    <div>
      <Header/>
      <Outlet/>
    </div>
  )
}

export default Body