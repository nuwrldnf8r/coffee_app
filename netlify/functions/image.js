const axios = require('axios')

const get = async (cid) => {
    const path = `https://nftupload.infura-ipfs.io/ipfs/${cid}`
    console.log(path)
    try{
        const ret = await axios.get(path)
        
        const data = ret.data
        const base64Data = data.split(",")[1]
        //const binaryImageData = atob(base64Data)
        return base64Data //binaryImageData.toString('base64')
    } catch(e) {
        return {error: e.message}
    }
}

exports.handler = async (event, context) => {
    if(!event.queryStringParameters.cid) return { statusCode: 400, body: JSON.stringify({error: 'cid must be present' })}
    let data = await get(event.queryStringParameters.cid)
    //console.log(data)
    return { statusCode: 200, headers: {'Content-Type': 'image/jpeg'}, body: data, isBase64Encoded: true}
}