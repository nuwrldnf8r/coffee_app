import axios from 'axios'
const endpoint = "/.netlify/functions"

export const addFarm = async (mobile, farmName, metadata) => {
    try{
        const ret = await axios.post(`${endpoint}/farm_info_canister`,{method: 'add_farm',mobile,farmName, metadata: metadata})
        return ret.data
    } catch(e){
        return e.message
    }
}

export const getFarm = async (mobile, farmName) => {
    try{
        const ret = await axios.get(`${endpoint}/farm_info_canister?method=get_farm&mobile=${mobile}&farmName=${farmName}`)
        return ret.data[0]
    } catch(e){
        return e.message
    }
}

export const getFarms = async (mobile) => {
    try{
        const ret = await axios.get(`${endpoint}/farm_info_canister?method=get_farms&mobile=${mobile}`)
        return ret.data
    } catch(e){
        return e.message
    }
}

export const updateWorker = async (mobile, farmName, name, id, role, image_cid) => {
    console.log('role::' + role)
    try{
        const ret = await axios.post(`${endpoint}/farm_info_canister`,{method: 'update_worker', mobile, farmName, name, id, role,image_cid})
        return ret.data
    } catch(e){
        return e.message
    }
}

export const getWorkers = async (mobile, farmName) => {
    try{
        const ret = await axios.get(`${endpoint}/farm_info_canister?method=get_workers&mobile=${mobile}&farmName=${farmName}`)
        return ret.data
    } catch(e){
        return e.message
    }
}

export const getWorker = async (mobile, farmName, id) => {
    try{
        const ret = await axios.get(`${endpoint}/farm_info_canister?method=get_worker&mobile=${mobile}&farmName=${farmName}&id=${id}`)
        return ret.data[0]
    } catch(e){
        return e.message
    }
}

export const deleteWorker = async (mobile, id) => {
    try{
        const ret = await axios.post(`${endpoint}/farm_info_canister`, {method: 'delete_worker', mobile, id})
        return ret.data
    } catch(e){
        return e.message
    }
}

export const deleteFarm = async (mobile, farm) => {
    try{
        const ret = await axios.post(`${endpoint}/farm_info_canister`, {method: 'delete_farm', mobile, farm})
        return ret.data
    } catch(e){
        return e.message
    }
}

export const getFarmFromWorkerId = async (mobile, id) => {
    try{
        const ret = await axios.get(`${endpoint}/farm_info_canister?method=get_farm_from_workerid&mobile=${mobile}&id=${id}`)
        return ret.data[0]
    } catch(e){
        return e.message
    }
}

export const getWorkersFromWorkerId = async (mobile, id) => {
    try{
        const ret = await axios.get(`${endpoint}/farm_info_canister?method=get_workers_from_workerid&mobile=${mobile}&id=${id}`)
        return ret.data
    } catch(e){
        return e.message
    }
}

export const id = async (mobile) => {
    try{
        const ret = await axios.get(`${endpoint}/farm_info_canister?method=id&mobile=${mobile}`)
        return ret.data
    } catch(e){
        return e.message
    }
}