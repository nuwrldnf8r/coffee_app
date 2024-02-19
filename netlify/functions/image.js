const IPFS = require('ipfs-infura');
const { Actor, HttpAgent } = require('@dfinity/agent')
const axios = require('axios')
const {Secp256k1KeyIdentity} = require('@dfinity/identity-secp256k1')
const idlFactory = ({ IDL }) => {
    return IDL.Service({
      'get' : IDL.Func([IDL.Text], [IDL.Vec(IDL.Nat8)], ['query']),
      'upload' : IDL.Func([IDL.Vec(IDL.Nat8)], [IDL.Text], []),
    });
};

const canisterId = 'gtqvw-rqaaa-aaaak-afn6a-cai'
const host =  'https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=gtqvw-rqaaa-aaaak-afn6a-cai'

const getIdentity = async () => {
    const seed = process.env.ADMIN_SEED_PHRASE
    return await Secp256k1KeyIdentity.fromSeedPhrase(seed)
}

const createActor = async () => {
    const identity = await getIdentity()
    console.log(identity.getPrincipal().toText())
  
    try{
      let agent = new HttpAgent({fetch, host, identity})
      return Actor.createActor(idlFactory, {
        agent,
        canisterId,
      }, )
    } catch(e){
      return {error: e.message}
    }
}

const get = async (cid) => {
    /*
    const path = `https://nftupload.infura-ipfs.io/ipfs/${cid}`
    console.log(path)
    try{
        let ret = await axios.get(path)
        return ret.data
    } catch(e) {
        return {error: e.message}
    }
    */
    let actor = await createActor()  
    try{
        let ret = await actor.get(cid)
        let data = Buffer.from(ret).toString()
        const base64Data = data.split(",")[1]
        return base64Data
    } catch (e){
        return {error: e.message}
    }
    

}

/*
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
*/


exports.handler = async (event, context) => {
    if(!event.queryStringParameters.cid) return { statusCode: 400, body: JSON.stringify({error: 'cid must be present' })}
    let data = await get(event.queryStringParameters.cid)
    //console.log(data)
    return { statusCode: 200, headers: {'Content-Type': 'image/jpeg'}, body: data, isBase64Encoded: true}
}