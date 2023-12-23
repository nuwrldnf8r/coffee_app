import axios from 'axios'

export const get = async (mobile,key) => {
    try{
        const ret = await axios.get(`/.netlify/functions/data?mobile=${mobile}&key=${key}`)
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

