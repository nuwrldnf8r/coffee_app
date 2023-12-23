import axios from 'axios'

export const add = async (data) => {
    try{
        const ret = await axios.post('/.netlify/functions/ipfs',{data})
        return ret.data
    } catch(e){
        console.log(e)
    }

}

export const get = async (cid) => {
    try{
        const ret = await axios.get(`/.netlify/functions/ipfs?cid=${cid}`)
        return ret.data
    } catch(e){
        console.log(e)
    }
}

