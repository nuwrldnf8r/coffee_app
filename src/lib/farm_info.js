import {get as _get} from './data'

//let $data = null

export const get = async (mobile) => {
    let data = await _get(mobile, 'farmdata')
    return data
}