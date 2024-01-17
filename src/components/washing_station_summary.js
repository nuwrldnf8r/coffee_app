import React from 'react'
import {SaveIcon} from '../icons/icons.js'

const formatTimestamp = (timestamp, timeZone) => {
    const date = new Date(timestamp);
    
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // Use 24-hour clock
      timeZone: timeZone,
    };
  
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

const trimAfterDot = (inputString) => {
    const dotIndex = inputString.indexOf('.');
    if (dotIndex !== -1) {
      return inputString.substring(0, dotIndex + 4);
    } else {
      return inputString;
    }
}

const WashingStationSummary = (props) => {
    console.log(props)
    return (
        <div class="grid grid-cols-1 mx-5 mt-5">
            <div class="text-xs">GPS:
                <div class="inline text-slate-500 text-center pl-5">  {props.coordinates.latitude} {props.coordinates.longitude}</div> 
                <div class="text-xs  text-slate-500 text-center">(accuracy: {trimAfterDot(props.coordinates.accuracy.toString())})</div>
            </div>
            <div class="text-xs">Timestamp:</div>
            <div class="mb-2 text-xs text-slate-500 text-center">{formatTimestamp(props.ts)}</div>
            <div class="text-xs  mb-2">Recorded weight:
            <div class="inline text-slate-500"> {props.weight}</div></div>
            <div class="text-xs">Tractor Bin ID: <div class="inline text-slate-500"> {props.tractorBinID}</div></div>
            <div class="text-xs mt-2">Washing Station Bin ID: <div class="inline text-slate-500"> {props.washingStationBinID}</div></div>
            <div class="text-center mt-5 align-middle"><button onClick={props.save}><SaveIcon/> Save</button></div>
        </div>
    )
}

export default WashingStationSummary