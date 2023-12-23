const IPFS = require('ipfs-infura');
const axios = require('axios')

const add = async (data) => {
    const ipfs = new IPFS({
        host: 'ipfs.infura.io', 
        port: 5001, 
        protocol: 'https', 
        projectId: process.env.INFURA_ID, 
        projectSecret: process.env.INFURA_SECRET 
    })

    return await ipfs.add(data)
}

const get = async (cid) => {
    const path = `https://nftupload.infura-ipfs.io/ipfs/${cid}`
    console.log(path)
    try{
        let ret = await axios.get(path)
        return ret.data
    } catch(e) {
        return {error: e.message}
    }
}

exports.handler = async (event, context) => {
    if(event.httpMethod==='POST'){
        try{
            const {data} = JSON.parse(event.body) 
            let cid = await add(data)
            return {statusCode: 200, body: cid}

        } catch(e){
            return { statusCode: 400, body: JSON.stringify({error: e.message })}
        }
    }
    if(!event.queryStringParameters.cid) return { statusCode: 400, body: JSON.stringify({error: 'cid must be present' })}
    try{
        let data = await get(event.queryStringParameters.cid)
        return { statusCode: 200, body: JSON.stringify({data})}
    } catch(e){
        return { statusCode: 400, body: JSON.stringify({error: e.message })}
    }

    
}

