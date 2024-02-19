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

const add = async (data) => {

    let actor = await createActor()  
    let b = Buffer.from(data)
    let ret = await actor.upload(b)
    return ret

    /*
    //ADMIN_SEED_PHRASE
    if(!data) return 'null'
    const ipfs = new IPFS({
        host: 'ipfs.infura.io', 
        port: 5001, 
        protocol: 'https', 
        projectId: process.env.INFURA_ID, 
        projectSecret: process.env.INFURA_SECRET 
    })

    return await ipfs.add(data)
    */
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
    let ret = await actor.get(cid)
    return  {data: Buffer.from(ret).toString()}
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

