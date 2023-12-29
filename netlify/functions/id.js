const crypto = require('crypto')
const ec = require('elliptic').ec
const { Actor, HttpAgent } = require('@dfinity/agent')
const bip39 = require('bip39')
//const {Principal} = require('@dfinity/principal')

const {Secp256k1KeyIdentity} = require('@dfinity/identity-secp256k1')

const idlFactory = ({ IDL }) => {
  const Farm = IDL.Record({
    'name' : IDL.Text,
    'geohash' : IDL.Text,
    'farmer' : IDL.Text,
  });
  const Role = IDL.Variant({
    'Scout' : IDL.Null,
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
    'add_farm' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'get_farm' : IDL.Func([IDL.Text], [IDL.Opt(Farm)], ['query']),
    'get_farms' : IDL.Func([], [IDL.Vec(Farm)], ['query']),
    'get_worker' : IDL.Func([IDL.Text, IDL.Text], [IDL.Opt(Person)], ['query']),
    'get_workers' : IDL.Func([IDL.Text], [IDL.Vec(Person)], ['query']),
    'id' : IDL.Func([], [IDL.Text], ['query']),
    'update_worker' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, Role, IDL.Text],
        [],
        [],
      ),
  });
};


const canisterId =  'nqvbb-mqaaa-aaaak-afhsq-cai' //"nqvbb-mqaaa-aaaak-afhsq-cai"
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

const getIdentity = async (mobile) => {
  const kp = getKeyPair(mobile)
  const mnemonic = bip39.entropyToMnemonic(kp.privateKeyHex)
  return await Secp256k1KeyIdentity.fromSeedPhrase(mnemonic)
}

const createActor = async (mobile) => {
  //let principal = createPrincipal(mobile)
  const identity = await getIdentity(mobile)
  
  try{
    const agent = new HttpAgent({host: host, identity})
    //agent.fetchRootKey()
    return Actor.createActor(idlFactory, {
      agent,
      canisterId,
    })
  } catch(e){
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


exports.handler = async (event, context) => {
    if(event.queryStringParameters.mobile){
        try{
            let _id = await id(event.queryStringParameters.mobile)
            return { statusCode: 200, body: JSON.stringify({id: _id}) }
        } catch(e){
            return { statusCode: 400, body: JSON.stringify({error: e.message })}
        }
    }
    return { statusCode: 400, body: JSON.stringify({error: 'Invalid request' })}
}