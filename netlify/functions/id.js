const crypto = require('crypto')
const ec = require('elliptic').ec
const bip39 = require('bip39')
const {Secp256k1KeyIdentity} = require('@dfinity/identity-secp256k1')
  
const getKeyPair = (mobile) => {
    const secret = mobile
    const privateKeyBuffer = crypto.createHmac('sha256', process.env.IDENTITY_SALT)
      .update(secret)
      .digest()
  
    const privateKeyHex = privateKeyBuffer.toString('hex')
    const secp256k1 = new ec('secp256k1');
    const keyPair = secp256k1.keyFromPrivate(privateKeyHex, 'hex')
    const publicKeyHex = keyPair.getPublic('hex')
    return {privateKeyHex, publicKeyHex}
}

const getIdentity = async (mobile) => {
  const kp = getKeyPair(mobile)
  const mnemonic = bip39.entropyToMnemonic(kp.privateKeyHex)
  return await Secp256k1KeyIdentity.fromSeedPhrase(mnemonic)
}

const id = async (mobile) => {
  try{
    const identity = await getIdentity(mobile)
    let ret = identity.getPrincipal().toText()
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