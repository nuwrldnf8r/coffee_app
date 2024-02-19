

const crypto = require('crypto')
const ec = require('elliptic').ec
const { Actor, HttpAgent } = require('@dfinity/agent')
const bip39 = require('bip39')
//const {Principal} = require('@dfinity/principal')

const {Secp256k1KeyIdentity} = require('@dfinity/identity-secp256k1')


const idlFactory = ({ IDL }) => {
  const Data = IDL.Record({
    'id' : IDL.Text,
    'ts' : IDL.Int64,
    'metadata' : IDL.Text,
    'farm_id' : IDL.Vec(IDL.Nat8),
  });
  const Farm = IDL.Record({
    'metadata' : IDL.Text,
    'name' : IDL.Text,
    'farmer' : IDL.Text,
  });
  const Role = IDL.Variant({
    'Farmer' : IDL.Null,
    'Harvester' : IDL.Null,
    'ReceivingManager' : IDL.Null,
    'FarmManager' : IDL.Null,
    'FactoryManager' : IDL.Null,
    'FieldManager' : IDL.Null,
  });
  const Person = IDL.Record({
    'id' : IDL.Text,
    'image_cid' : IDL.Text,
    'name' : IDL.Text,
    'role' : Role,
    'approved' : IDL.Bool,
  });
  return IDL.Service({
    'add_data' : IDL.Func([IDL.Text, IDL.Int64, IDL.Text, IDL.Text], [], []),
    'add_farm' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'get_data_by_farm' : IDL.Func(
        [IDL.Text, IDL.Int64, IDL.Int64],
        [IDL.Vec(Data)],
        [],
      ),
    'get_data_by_id' : IDL.Func([IDL.Text], [Data], []),
    'get_farm' : IDL.Func([IDL.Text], [IDL.Opt(Farm)], ['query']),
    'get_farm_from_workerid' : IDL.Func([IDL.Text], [IDL.Opt(Farm)], ['query']),
    'get_farms' : IDL.Func([], [IDL.Vec(Farm)], ['query']),
    'get_worker' : IDL.Func([IDL.Text, IDL.Text], [IDL.Opt(Person)], ['query']),
    'get_workers' : IDL.Func([IDL.Text], [IDL.Vec(Person)], ['query']),
    'get_workers_from_workerid' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(Person)],
        ['query'],
      ),
    'id' : IDL.Func([], [IDL.Text], ['query']),
    'update_farmer' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text, Role, IDL.Text],
        [],
        [],
      ),
    'update_worker' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, Role, IDL.Text],
        [],
        [],
      ),
  });
}

const canisterId =  'nqvbb-mqaaa-aaaak-afhsq-cai' //"nqvbb-mqaaa-aaaak-afhsq-cai"
//const host = 'https://icp-api.io'
const host = 'https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io'
  
const getKeyPair = (mobile) => {
    const secret = mobile
    const privateKeyBuffer = crypto.createHmac('sha256', process.env.IDENTITY_SALT)
      .update(secret)
      .digest()
  
    const privateKeyHex = privateKeyBuffer.toString('hex')
    const secp256k1 = new ec('secp256k1');
    const keyPair = secp256k1.keyFromPrivate(privateKeyHex, 'hex')
    ;
    const publicKeyHex = keyPair.getPublic('hex')
    return {privateKeyHex, publicKeyHex}
}
  
/*
const createPrincipal = (mobile) => {
    console.log('creating Principal')
    try{
      const kp = getKeyPair(mobile)
      console.log('got keypair')
      const principal = Principal.fromHex(kp.publicKeyHex)
      //const principal = Principal.fromHex(kp.privateKeyHex)
      return principal
    } catch(e){
      console.log(e)
      return null
    }
    
}
*/

const getIdentity = async (mobile) => {
  const kp = getKeyPair(mobile)
  const mnemonic = bip39.entropyToMnemonic(kp.privateKeyHex)
  return await Secp256k1KeyIdentity.fromSeedPhrase(mnemonic)
}

const createActor = async (mobile) => {
  //let principal = createPrincipal(mobile)
  const identity = await getIdentity(mobile)

  /*
  const agent = new HttpAgent({
      // ...
      verifyQuerySignatures: false,
  });
  */
  
  try{
    const agent = new HttpAgent({host: host, identity, timeout: 30000})
    //agent.fetchRootKey()
    return Actor.createActor(idlFactory, {
      agent,
      canisterId,
    })
  } catch(e){
    return {error: e.message}
  }
}

const addFarm = async (mobile, farmName, metadata) => {
    try{
      const actor = await createActor(mobile)
      console.log('adding farm')
      await actor.add_farm(farmName, metadata)
      return {success:true}
    } catch(e){
      console.log(e)
      return {error: e.message}
    }
}

const getFarm = async (mobile, farmName) => {
  try{
    const actor = await createActor(mobile)
    return await actor.get_farm(farmName)
  } catch(e){
    console.log(e)
    return {error: e.message}
  }
}

const getFarms = async (mobile) => {
  try{
    const actor = await createActor(mobile)
    return await actor.get_farms()
  } catch(e){
    console.log(e)
    return {error: e.message}
  }
}

const getWorker = async (mobile, farmName, id) => {
  try{
    const actor = await createActor(mobile)
    return await actor.get_worker(farmName, id)
  } catch(e){
    console.log(e)
    return {error: e.message}
  }
}

const getWorkers = async (mobile, farmName) => {
  try{
    const actor = await createActor(mobile)
    return await actor.get_workers(farmName)
  } catch(e){
    console.log(e)
    return {error: e.message}
  }
}

const updateWorker = async (mobile, farmName, name, id, role, image_cid) => {
  try{
    console.log('updating worker')
    const actor = await createActor(mobile)
    console.log('actor created')
    let roles = {
      'Scout' : {Scout: null},
      'Farmer' : {Farmer: null},
      'Harvester' : {Harvester: null},
      'ReceivingManager' : {ReceivingManager: null},
      'FarmManager' : {FarmManager: null},
      'FactoryManager' : {FactoryManager: null},
      'FieldManager' : {FieldManager: null}
    }
   
    console.log('***************')
    console.log(farmName, name, id, roles[role], image_cid)
    console.log('***************')
    

    await actor.update_worker(farmName, name, id, roles[role], image_cid)
    return {success: true}

  } catch(e){
    console.log(e)
    return {error: e.message}
  }
}

const deleteWorker = async (mobile, id) => {
  try{
    const actor = await createActor(mobile)
    
    await actor.delete_worker(id)
    return {success: true}

  } catch(e){
    console.log(e)
    return {error: e.message}
  }
}

const deleteFarm = async (mobile, farm) => {
  try{
    const actor = await createActor(mobile)
    
    await actor.delete_farm(farm)
    return {success: true}

  } catch(e){
    console.log(e)
    return {error: e.message}
  }
}

const getFarmFromWorkerId = async (mobile, id) => {
  try{
    const actor = await createActor(mobile)
    return await actor.get_farm_from_workerid(id)
  } catch(e){
    console.log(e)
    return {error: e.message}
  }
}

const getWorkersFromWorkerId = async (mobile, id) => {
  try{
    const actor = await createActor(mobile)
    return await actor.get_workers_from_workerid(id)
  } catch(e){
    console.log(e)
    return {error: e.message}
  }
}


const id = async (mobile) => {
  try{
    const actor = await createActor(mobile)
    let ret = await actor.id()
    return ret

  } catch(e){
    console.log(e)
    return {error: e.message}
  }
}

const addData = async (mobile, id, ts, farm, metadata) => {
  try{
    const actor = await createActor(mobile)
    await actor.add_data(id,BigInt(ts),farm,metadata)
    return {success: true}

  } catch(e){
    console.log(e)
    return {error: e.message}
  }
}

const getDataByID = async (mobile, id) => {
  try{
    const actor = await createActor(mobile)
    let ret = await actor.get_data_by_id(id)
    return ret

  } catch(e){
    console.log(e)
    return {error: e.message}
  }
}

const getDataByFarm = async (mobile, farm, tsStart, tsEnd) => {
  console.log('getting data by farm')
  try{
    const actor = await createActor(mobile)
    let ret = await actor.get_data_by_farm(farm, BigInt(tsStart), BigInt(tsEnd))
    ret = ret.map(data=>{
      data.ts = parseInt(data.ts.toString())
      data.metadata = JSON.parse(data.metadata)
      return data
    })
    console.log(ret)

    return ret

  } catch(e){
    console.log(e)
    return {error: e.message}
  }
}

exports.handler = async (event, context) => {
  if(event.httpMethod==='POST'){
      try{
          const body = JSON.parse(event.body) 
          console.log(body)
          console.log('cid: ', (body.image_cid))
          let ret = {error: 'Invalid parameters'}
          if(body.method && body.method==='add_farm' && body.mobile && body.farmName && body.metadata){
            ret = await addFarm(body.mobile, body.farmName, body.metadata)
          }
          if(body.method && body.method==='update_worker' && body.mobile && body.farmName && body.name && body.id && body.role){
            console.log('********************')
            console.log(body.mobile,body.farmName,body.name,body.id,body.role,body.image_cid)
            ret = await updateWorker(body.mobile,body.farmName,body.name,body.id,body.role,body.image_cid)
          }
          if(body.method && body.method==='delete_worker' && body.mobile && body.id){
            ret = await deleteWorker(body.mobile,body.id)
          }
          if(body.method && body.method==='delete_farm' && body.mobile && body.farm){
            ret = await deleteFarm(body.mobile,body.farm)
          }
          if(body.method && body.method==='add_data' && body.id && body.ts && body.farm && body.metadata){
            ret = await addData(body.mobile,body.id,body.ts,body.farm,body.metadata)
          }
          if(!ret.error) return { statusCode: 200, body: JSON.stringify({success: true}) }
          return { statusCode: 400, body: JSON.stringify(ret)}
      } catch(e){
          console.log('crap')
          return { statusCode: 400, body: JSON.stringify({error: e.message })}
      }
  } else {
      const params = event.queryStringParameters
      try{
        let ret = {error: 'Invalid parameters'}
        if(params.method && params.method==='get_farm' && params.mobile && params.farmName){
          ret = await getFarm(params.mobie,params.farmName)
        }
        if(params.method && params.method==='get_farms' && params.mobile){
          ret = await getFarms(params.mobile)
        }
        if(params.method && params.method==='get_worker' && params.mobile && params.farmName && params.id){
          ret = await getWorker(params.mobile, params.farmName, params.id)
        }
        if(params.method && params.method==='get_workers' && params.mobile && params.farmName){
          ret = await getWorkers(params.mobile, params.farmName)
        }   
        if(params.method && params.method==='id' && params.mobile){
          ret = await id(params.mobile)
        }
        if(params.method && params.method==='get_farm_from_workerid' && params.mobile && params.id){
          ret = await getFarmFromWorkerId(params.mobile, params.id)
        }
        if(params.method && params.method==='get_workers_from_workerid' && params.mobile && params.id){
          ret = await getWorkersFromWorkerId(params.mobile, params.id)
        }
        if(params.method && params.method==='get_data_by_id' && params.mobile && params.id){
          ret = await getDataByID(params.mobile, params.id)
        }
        if(params.method && params.method==='get_data_by_farm' && params.mobile && params.farm && params.tsStart && params.tsEnd){
          ret = await getDataByFarm(params.mobile, params.farm, params.tsStart, params.tsEnd)
        }
        if(!ret.error) return { statusCode: 200, body: JSON.stringify(ret) }
        return { statusCode: 400, body: JSON.stringify(ret)}
      } catch(e) {
        console.log(e)
        return { statusCode: 400, body: JSON.stringify({error: e.message })}
      }
      
  }
}





