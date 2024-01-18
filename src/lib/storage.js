import Geohash from 'latlon-geohash'
/*
    Need to store locally, then check if internet connection is available and store in db.
    Update when last uploaded online.
    Mark stuff that's already stored in db and archive as list gets too long.

    Store stuff as 'sessions' - ie a bunch of information collected ointo a packet and then stored = 1 session
*/

export const Keys = {
    localStorageKeyCollected: 'collected'
}

function geohashToHex(geohash) {
    const base32Chars = '0123456789bcdefghjkmnpqrstuvwxyz'; // Note: Geohash uses a custom base32 encoding
    let hexString = '';
  
    for (let i = 0; i < geohash.length; i++) {
      const base32Char = geohash[i];
      const base32Value = base32Chars.indexOf(base32Char);
      hexString += base32Value.toString(16).padStart(2, '0');
    }
  
    return hexString;
}

function hexToGeohash(hex) {
    const base32Chars = '0123456789bcdefghjkmnpqrstuvwxyz';
    let geohash = '';
  
    for (let i = 0; i < hex.length; i += 2) {
      const hexPair = hex.substring(i, i + 2);
      const decimalValue = parseInt(hexPair, 16);
      const base32Char = base32Chars[decimalValue % 32];
      geohash += base32Char;
    }
  
    return geohash;
} 

function hexToBase64(hex) {
    const buffer = new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))
    return btoa(String.fromCharCode(...buffer)).split('=').join('')
}

function base64ToHex(base64) {
    while(base64.length%4!==0)base64 += '='
    const buffer = new Uint8Array(atob(base64).split('').map(char => char.charCodeAt(0)))
    return Array.from(buffer).map(byte => byte.toString(16).padStart(2, '0')).join('')
}

function weightToHex(w) {
    let h = w.toString().split('.')
    if(h.length===1) return parseInt(h).toString(16).padStart(6,'0')
    return parseInt(h[0]).toString(16).padStart(6,'0') + parseInt(h[1]).toString(16).padStart(6,'0')
}

function hexToWeight(h) {
    let w = [parseInt(h.substring(0,6),16).toString(),parseInt(h.substring(6),16).toString()].join('.')
    return parseFloat(w)
}

function stringToHex(str) {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      hex += code.toString(16).padStart(2, '0');
    }
    return hex;
}

function hexToString(hex) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      const hexPair = hex.substr(i, 2);
      const charCode = parseInt(hexPair, 16);
      str += String.fromCharCode(charCode);
    }
    return str;
  }

const infieldCollectionID = (coordinates,ts,weight,bucketID) => {
    let geohash = Geohash.encode(coordinates.latitude,coordinates.longitude,14)
    let geohex = geohashToHex(geohash)
    let tshex = ts.toString(16).padStart(14, '0')
    let weighthex = weightToHex(weight)
    console.log('weight',weighthex.length)
    let bucketHex = bucketID.toString(16).padStart(6,'0')
    return hexToBase64(stringToHex('c') + tshex + weighthex + bucketHex + geohex)
}

const decodeInfieldCollectionID = (id) => {
    
    let hex = base64ToHex(id)
    let prefix = hexToString(hex.substring(0,2))
    if(prefix!=='c') throw new Error('invalid id')
    hex = hex.substring(2)
    let tshex = hex.substring(0,14)
    let ts = parseInt(tshex,16)
    let weight = hexToWeight(hex.substring(14,20))
    let bucketID = parseInt(hex.substring(20,26),16)
    let geohex = hex.substring(26)
    let geohash = hexToGeohash(geohex)
    let coordinates = Geohash.decode(geohash)
    return {coordinates, ts, weight, bucketID}
}

const collectionPointID = (coordinates,ts,weight,bucketID,binID) => {
    let geohash = Geohash.encode(coordinates.latitude,coordinates.longitude,14)
    let geohex = geohashToHex(geohash)
    let tshex = ts.toString(16).padStart(14, '0')
    let weighthex = weightToHex(weight)
    let bucketHex = bucketID.toString(16).padStart(6,'0')
    let binHex = binID.toString(16).padStart(6,'0')
    return hexToBase64(stringToHex('C') + tshex + weighthex + bucketHex + binHex + geohex)
}

const decodeCollectionPointID = (id) => {
    let hex = base64ToHex(id)
    let prefix = hexToString(hex.substring(0,2))
    if(prefix!=='C') throw new Error('invalid id')
    hex = hex.substring(2)
    let tshex = hex.substring(0,14)
    let ts = parseInt(tshex,16)
    let weight = hexToWeight(hex.substring(14,20))
    let bucketID = parseInt(hex.substring(20,26),16)
    let binID = parseInt(hex.substring(26,32),16)
    let geohex = hex.substring(32)
    let geohash = hexToGeohash(geohex)
    let coordinates = Geohash.decode(geohash)
    return {coordinates, ts, weight, bucketID, binID}
}

const washingStationID = (coordinates,ts,weight,binID,wsBinID) => {
    let geohash = Geohash.encode(coordinates.latitude,coordinates.longitude,14)
    let geohex = geohashToHex(geohash)
    let tshex = ts.toString(16).padStart(14, '0')
    let weighthex = weightToHex(weight)
    let binHex = binID.toString(16).padStart(6,'0')
    let wsBinHex = wsBinID.toString(16).padStart(6,'0')
    return hexToBase64(stringToHex('W') + tshex + weighthex + binHex + wsBinHex + geohex)
}

const decodeWashingStationID = (id) => {
    let hex = base64ToHex(id)
    let prefix = hexToString(hex.substring(0,2))
    if(prefix!=='W') throw new Error('invalid id')
    hex = hex.substring(2)
    let tshex = hex.substring(0,14)
    let ts = parseInt(tshex,16)
    let weight = hexToWeight(hex.substring(14,20))
    let binID = parseInt(hex.substring(20,26),16)
    let wsBinID = parseInt(hex.substring(26,32),16)
    let geohex = hex.substring(32)
    let geohash = hexToGeohash(geohex)
    let coordinates = Geohash.decode(geohash)
    return {coordinates, ts, weight, binID, wsBinID}
}

const decode = (id) => {
    let hex = base64ToHex(id)
    let prefix = hexToString(hex.substring(0,2))
    if(prefix==='c') return {id, type: 'c', data: decodeInfieldCollectionID(id)}
    if(prefix==='C') return {id, type: 'C', data: decodeCollectionPointID(id)}
    if(prefix==='W') return {id, type: 'W', data: decodeWashingStationID(id)}
    return {type: 'none', data: id}
}

export const ID = {
    infieldCollectionID, 
    decodeInfieldCollectionID,
    collectionPointID,
    decodeCollectionPointID,
    washingStationID,
    decodeWashingStationID,
    decode,
    base64ToHex,
    hexToBase64
}

export const LocalStore = {

    getData: (key) => {
        let store = localStorage.getItem(key)
        if(store) store = JSON.parse(store)
        store = store || null
        return store
    },

    addData: (key, data) => {
        localStorage.setItem(key, JSON.stringify(data))
    },

    deleteData: (key) => {
        localStorage.removeItem(key)
    }

    
}

