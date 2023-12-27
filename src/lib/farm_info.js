import {get as _get, set as _set, getPrincipal} from './data'
import {add, get} from './ipfs'

//let $data = null

export const getAll = async (mobile) => {
    console.log('getting cid')
    let cid = await _get(mobile, 'farmdata')
    console.log('cid:', cid)
    if(!cid) return []
    console.log('fetching data')
    let data = await get(cid)
    console.log(data)
    return data.data
}

export const set = async (mobile, farmName) => {
    let data = await getAll(mobile)
    console.log(data)
    if(data.length>0 && data.find(item=>item.name.split(' ').join('').toLowerCase()===farmName.split(' ').join('').toLowerCase())){
        console.log('farm already exists')
        throw new Error('Farm already exists')
    }
    let principal = await getPrincipal(mobile)
    data.push({name: farmName, farmerId: principal.principal})
    console.log('data',data)
    console.log('getting new cid')
    let cid = await add(JSON.stringify(data))
    console.log(cid)
    await _set(mobile,'farmdata',cid)
    console.log('done')
    return
    
}

export const addStaff = async (mobile, farmName, user, role) => {
    console.log('adding staff')
    if(user.mobile){
        console.log('getting user prinsipal')
        const principal = await getPrincipal(user.mobile)
        user.id = principal.principal
        console.log(user)
        delete user.mobile
        console.log('getting farm cid')
        const farmCID = await _get(mobile, farmName)
        console.log(farmCID)
        console.log('getting farm')
        let farm = []
        if(farmCID) farm = await get(farmCID)
        console.log(farm)
        console.log('finding farmer')
        let farmer = farm.data.find(u=>u.role==='Farmer')
        console.log(farmer)
        if(farmer && role==='Farmer'){
            if(farmer.id !== user.id){
                throw Error('Farmer already exists')
            } else {
                return
            }
        }
        
        if(farmer){
            console.log('getting farmer principal')
            let farmerPrincipal = await getPrincipal(mobile)
            console.log(farmerPrincipal)
            user.verified = (farmerPrincipal.principal===farmer.id)
        } else {
            user.verified = true
        }
        user.role = role
        console.log('adding user to farm')
        farm.push(user)
        console.log(farm)
        console.log('getting new cid')
        let cid = await add(JSON.stringify(farm))
        console.log(cid)
        console.log('setting farm cid')
        _set(mobile,farmName,cid)
        console.log('done')
        return farm
    }
}

export const updateStaffMember = async (mobile, farmName, user) => {
    //update induvidual staff member info
}