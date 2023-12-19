import React from 'react'

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

const Summary = (props) => {
    return (
        <div class="grid grid-cols-1 m-5">
            <div class="my-2">GPS: 
                <div class="inline text-slate-500">{props.coordinates.latitude} {props.coordinates.longitude}</div> 
                <div class="text-xs  text-slate-500 text-right">(accuracy: {trimAfterDot(props.coordinates.accuracy.toString())})</div>
            </div>
            <div>Timestamp:</div>
            <div class="mb-2  text-slate-500">{formatTimestamp(props.ts)}</div>
            <div class="my-2">Recorded weight: <div class="inline text-slate-500">{props.weight}</div></div>
            <div>Bucket Photo:</div>
            <div><img src={props.image} alt="Bucket"/></div>
        </div>
    )
}

export default Summary