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
  console.log('creating Principal')
  try{
    const kp = getKeyPair(mobile)
    console.log('got keypair')
    const principal = Principal.fromHex(kp.publicKeyHex)
    return principal
  } catch(e){
    console.log(e)
    return null
  }
  
}

async function get(mobile, key) {
  let principal = createPrincipal(mobile)
  console.log('creating actor')
  try{
    const actor = Actor.createActor(idlFactory, {
      agent: new HttpAgent({host: host, principal}),
      canisterId,
    })
    
    console.log('key: ' + key)
    return await actor.get_cid(key)
  } catch(e){
    console.log(e)
    return {error: e.message}
  }
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
              console.log(`fetching data for ${event.queryStringParameters.mobile} && ${event.queryStringParameters.key}`)
              const result = await get(event.queryStringParameters.mobile, event.queryStringParameters.key)
              return { statusCode: 200, body: JSON.stringify(result[0]) }
            } catch(e){
              return { statusCode: 400, body: JSON.stringify({error: e.message})}
            }
        } else if(event.queryStringParameters.mobile){
            try{
              let principal = createPrincipal(event.queryStringParameters.mobile)
              

              return { statusCode: 200, body: JSON.stringify({principal:principal.toString()}) }
            } catch(e){
              return { statusCode: 400, body: JSON.stringify({error: e.message })}
            }
        }
        return { statusCode: 400, body: JSON.stringify({error: 'Invalid request' })}
    }
}