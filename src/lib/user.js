import axios from 'axios'

export const getKey = async (mobile) => {
    try{
        const ret = await axios.get(`/.netlify/functions/data?mobile=${mobile}`)
        return ret.data
    } catch(e){
        console.log(e)
    }
}