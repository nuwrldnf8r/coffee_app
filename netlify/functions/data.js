const crypto = require('crypto')
const ec = require('elliptic').ec
const { Actor, HttpAgent } = require('@dfinity/agent')
const {Principal} = require('@dfinity/principal')

const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'get_cid' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], []),
    'set_cid' : IDL.Func([IDL.Text, IDL.Text], [], []),
  });
};
const canisterId = "bbhk2-uiaaa-aaaak-afg4a-cai"
const host = 'https://icp-api.io'

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

const createPrincipal = (mobile) => {
  const kp = getKeyPair()
  const principal = Principal.fromHex(kp.publicKeyHex)
  return principal
}

async function get(mobile, key) {
  let principal = createPrincipal()
  const actor = Actor.createActor(idlFactory, {
    agent: new HttpAgent({host: host, principal}),
    canisterId,
  })
  return await actor.get_cid(key)
}

async function set(mobile, key, cid) {
  let principal = createPrincipal()
  const actor = Actor.createActor(idlFactory, {
    agent: new HttpAgent({host: host, principal}),
    canisterId,
  })
  return await actor.set_cid(key, cid)
}

exports.handler = async (event, context) => {
    if(event.httpMethod==='POST'){
        try{
            const {mobile, key, data} = JSON.parse(event.body) 
            await set(mobile, key, data)
            return { statusCode: 200, body: JSON.stringify({success: true}) }
        } catch(e){
            return { statusCode: 400, body: JSON.stringify({error: e.message })}
        }
    } else {
        if(event.queryStringParameters.mobile && event.queryStringParameters.key){
            try{
              const result = await get(event.queryStringParameters.mobile, event.queryStringParameters.key)
              return { statusCode: 200, body: JSON.stringify(result[0]) }
            } catch(e){
              return { statusCode: 400, body: JSON.stringify({error: e.message })}
            }
        }
        return { statusCode: 400, body: JSON.stringify({error: 'Both key and mobile need to be present as parameters' })}
    }
}