import axios from 'axios'

export const getPrincipal = async (mobile) => {
    try{
        const path = `/.netlify/functions/data?mobile=${mobile}`
        console.log(path)
        const ret = await axios.get(`/.netlify/functions/data?mobile=${mobile}`)
        return ret.data
    } catch(e){
        console.log(e)
    }
}

export const get = async (mobile,key) => {
    try{
        const path = `/.netlify/functions/data?mobile=${mobile}&key=${key}`
        console.log(path)
        const ret = await axios.get(path)
        return ret.data
    } catch(e){
        console.log(e)
    }
}

export const set = async (mobile, key, data) => {
    try{
        const ret = await axios.post('/.netlify/functions/data',{mobile,key,data})
        return ret.data
    } catch(e){
        console.log(e)
    }
}

