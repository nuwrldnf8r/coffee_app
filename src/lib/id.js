import axios from 'axios'

export const getID = async (mobile) => {
    try{
        const path = `/.netlify/functions/id?mobile=${mobile}`
        const ret = await axios.get(path)
        return ret.data
    } catch(e){
        console.log(e)
    }
}