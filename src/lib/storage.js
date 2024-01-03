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

function decodeId(id) {
    let hex = base64ToHex(id)
    let tshex = hex.substring(0,14)
    let ts = parseInt(tshex,16)
    let weight = hexToWeight(hex.substring(14,26))
    let bucketId = parseInt(hex.substring(26,32),16)
    let geohex = hex.substring(32)
    let geohash = hexToGeohash(geohex)
    let coordinates = Geohash.decode(geohash)
    return {coordinates, ts, weight, bucketId}
}
  
class CollectedData{
    constructor(data){
        this._data = data
    }

    get() {
        return this._data
    }

    id() {
        let geohash = Geohash.encode(this._data.coordinates.latitude,this._data.coordinates.longitude,14)
        let geohex = geohashToHex(geohash)
        let tshex = this._data.ts.toString(16).padStart(14, '0')
        let weighthex = weightToHex(this._data.weight)
        let bucketHex = this._data.bucketID.toString(16).padStart(6,'0')
        return hexToBase64(tshex + weighthex + bucketHex + geohex)
        //return  tshex + geohex
    }

    async save() {
        let data = Object.assign({},this._data)
        delete data.coordinates
        delete data.weight
        data.onlyLocal = true
        let store = LocalStore.getData(Keys.localStorageKeyCollected)
        console.log('ID: ' + this.id())
        if(store[this.id()] && !data.onlyLocal) {
            throw new Error("Collection already uploaded")
        }
        store[this.id()] = data
        localStorage.setItem(Keys.localStorageKeyCollected,JSON.stringify(store))
        this._data.onlyLocal = true
    }
}

export const LocalStore = {
    addCollectedData: (data) => {
        let _data = new CollectedData(data)
        _data.save()
        return _data
    },

    getCollectedData: () => {
        let data = this.getData(Keys.localStorageKeyCollected)
        let keys = Object.keys(data)
        return keys.map(key => {
            let item = data[key]
            let decoded = decodeId(key)
            item.coordinates = decoded.coordinates
            item.ts = decoded.ts
            item.weight = decoded.weight
            item.bucketId = decoded.bucketId
            item.id = key
            return item
        })
    },

    getData: (key) => {
        let store = localStorage.getItem(key)
        if(store) store = JSON.parse(store)
        store = store || null
        return store
    },

    addData: (key, data) => {
        localStorage.setItem(key, JSON.stringify(data))
    }

    
}

