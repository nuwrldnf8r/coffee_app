import React from 'react';
import { useState, useEffect} from 'react'
//import InField from './pages/infield_collection'
//import PeopleManagement from './pages/people_management.js'
import Register from './pages/register'
import Splash from './pages/splash'
import SignUp from './pages/signup'
import {add, get} from './lib/ipfs'

window.add = add
window.get = get

//https://github.com/tailwindlabs/tailwindcss-forms
//https://tailwindcss.com/docs/margin

/*

<div class="container mx-auto text-center mt-10">
  <div class="flex flex-row content-center h-7">
    <div class="basis-1/4 align-middle">Number</div>
    <input type="number" class="rounded-lg basis-1/2"/>
  </div>
</div>
*/

/*
  <PeopleManagement/>
  <InField /> 
  <Register/>
*/

const AppStatus = {startup: 0, initializing: 1, initialized: 2}

function App() {
  const [status, setStatus] = useState(AppStatus.startup)
  const [page, setPage] = useState('splash')

  useEffect(()=>{
    if(status===AppStatus.startup){
      setStatus(AppStatus.initializing)
      //check if user exists
      //if not:
      setTimeout(()=>setPage('register'),1000)
      
    }
  },[status])

  const signUp = (mobile) => {
    setPage('signup#' + mobile)
  }

  const logIn = (mobile) => {
    setPage('login#' + mobile)
  }

  return (
    <>
    <div class="text-center text-sm text-gray-300 dark:text-gray-400, m-1" style={{position: 'absolute', right: 0, top: 0}}>v0.007</div>
      {page==='splash' && 
        <Splash/>
      }
      {page==='register' && 
        <Register signUp={signUp} logIn={logIn}/>
      }
      {page.split('#')[0]==='signup' &&
        <SignUp mobile={page.split('#')[1]}/>
      }
      {page.split('#')[0]==='login' &&
        <div>Login  {page.split('#')[1]}</div>
      }
      
    </>
    
  );
}

export default App;
