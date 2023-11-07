
import { useState, useEffect } from "react";

type QueueTypeMap = {
  [key: number]: string;
};

function MatchCard (props:any) {
  const [queueType, setQueueType] = useState<string>('');
  const [timeDiff, setTimeDiff] = useState<num>(0);
  //convert queueID to respective queue type
  const idToQueueType: QueueTypeMap = {
    400: "Summoner's Rift Normal (Draft Pick)",
    420: "Ranked Solo/Duo Queue",
    430: "Summoner's Rift Normal (Blind Pick)",
    440: "Ranked Flex Queue",
    450: "ARAM"
  }

  //convert riotAPI time stamp to current time
  function calculateTimeDifference(riotTimestamp) {
    // Convert the Riot timestamp to seconds
    const timestampInSeconds = riotTimestamp / 1000;
  
    // Create a Date object for the game timestamp
    const gameDate = new Date(timestampInSeconds * 1000);
  
    // Get the current date
    const currentDate = new Date();
  
    // Calculate the time difference in milliseconds
    const timeDifference = currentDate - gameDate;
  
    if (timeDifference < 1000 * 60) {
      // Less than a minute ago
      return 'Just now';
    } else if (timeDifference < 1000 * 60 * 60) {
      // Less than an hour ago
      const minutesAgo = Math.floor(timeDifference / (1000 * 60));
      return `${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`;
    } else if (timeDifference < 1000 * 60 * 60 * 24) {
      // Less than a day ago
      const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));
      return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
    } else {
      // Days ago
      const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      return `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
    }
  }
  

  useEffect(() => {
    setQueueType(idToQueueType[props.match.queueId]);
    setTimeDiff(calculateTimeDifference(props.match.gameEndTime))
  },[props.match])
  return (
    <div className="card card-bordered w-96 bg-base-100 shadow-xl">
      <div className="card-body flex-row">
        <div id="matchCard-start">
          <h1>{queueType}</h1>
          <h3>{timeDiff}</h3>
        </div>
        <div id="matchCard-center">
          ds
        </div>
        <div className="grid grid-cols-2" id="matchCard-end">
          dsa
        </div>
      </div>
    </div>
  )
}

export default MatchCard;