import React from 'react';
import { useState, useEffect} from 'react'
//import InField from './pages/infield_collection'
import PeopleManagement from './pages/people_management.js'
import MyInfo from './pages/my-info.js';
import Register from './pages/register'
import Splash from './pages/splash'
import SignUp from './pages/signup'
import Dashboard from './pages/dashboard'
import InField from './pages/infield_collection'
import CollectionPoint from './pages/collection_point'
import WashingStation from './pages/washing_station'
//import {getPrincipal, get, set} from'./lib/data'
import { LocalStore } from './lib/storage'
//import {add as _add, get as _get} from './lib/ipfs'
//import {getID} from './lib/id'
import {getWorker, id, getFarmFromWorkerId} from './lib/farminfo'

/*
window.getPrincipal = getPrincipal
window.data = {get, set}
window.ipfs = {add: _add, get: _get}
window.getID = getID
window.addFarm = addFarm
window.getFarm = getFarm
window.getFarms = getFarms
window.id = id
window.updateWorker = updateWorker
window.getWorkers = getWorkers
window.getWorker = getWorker
*/


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
  const [user, setUser] = useState(null)
  const [loggingIn, setLoggingIn] = useState(false)
  const [people, setPeople] = useState([])

  useEffect(()=>{
    if(status===AppStatus.startup){
      setStatus(AppStatus.initializing)
      let me = LocalStore.getData('me')
      if(me){
        setUser(me)
        console.log(me)
        setPage('dashboard')
      } else {
        setTimeout(()=>setPage('register'),1000)
      }
      
      
    }
  },[status])

  const signUp = (mobile) => {
    setPage('signup#' + mobile)
  }

  const logIn = async (mobile) => {
    if(loggingIn) return
    setLoggingIn(true)
    let _id = await id(mobile)
    console.log(_id)
    console.log('getting farm')
    let farm = await getFarmFromWorkerId(mobile, _id)
    console.log(farm)
    if(!farm){
      signUp()
    } else {
      console.log('getting user')
      let user = await getWorker(mobile, farm.name, _id)
      if(!user){
        console.log('error - no user')
        return
      }
      //let user = {id: _id, name, mobile: props.mobile, farm, role, image: cid}
      user.farm = farm.name
      user.mobile = mobile
      LocalStore.addData('me',user)
      setUser(user)
      setPage('dashboard')
      setLoggingIn(false)
      //setPage('login#' + mobile)
    }
  }

  const addPerson = async (person) => {
    let _people = people.slice()
    _people.push(person)
    setPeople(_people)
    LocalStore.addData('people',_people)
  }

  const signupComplete = () => {
    setPage('dashboard')
  }

  const signOut = () => {
    LocalStore.deleteData('me')
    LocalStore.deleteData('people')
    setPage('splash')
    setStatus(AppStatus.startup)
  }

  return (
    <>
    <div class="text-center text-sm text-gray-300 dark:text-gray-400, m-1" style={{position: 'absolute', right: 0, top: 0}}>v0.012</div>
      {page==='splash' && 
        <Splash/>
      }
      {page==='register' && 
        <Register signUp={signUp} logIn={logIn} loggingIn={loggingIn}/>
      }
      {page.split('#')[0]==='signup' &&
        <SignUp mobile={page.split('#')[1]} complete={signupComplete}/>
      }
      {page.split('#')[0]==='login' &&
        <div>Login  {page.split('#')[1]}</div>
      }
      {page==='dashboard' && 
        <Dashboard setPage={setPage} me={user} setPeople={_people=>setPeople(_people)}/>
      }
      {page==='my_info' && 
        <MyInfo setPage={setPage} me={user} signOut={signOut}/>
      }
      {page==='people' && 
        <PeopleManagement setPage={setPage} me={user} people={people} addPerson={addPerson}/>
      }
      {page==='infield_collection' && 
        <InField setPage={setPage} me={user} />
      }
      {page==='collection_point' && 
        <CollectionPoint  setPage={setPage} me={user}/>
      }
      {page==='washing_station' && 
        <WashingStation setPage={setPage} me={user}/>
      }
      
    </>
    
  );
}

export default App;
