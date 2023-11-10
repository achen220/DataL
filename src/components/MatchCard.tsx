
import { useState, useEffect } from "react";

type QueueTypeMap = {
  [key: number]: string;
};
type participants = {
  blue: string[],
  red: string[],
}
function MatchCard (props:any) {
  const [queueType, setQueueType] = useState<string>();
  const [timeDiff, setTimeDiff] = useState<number>();
  const [timeDuration, setTimeDuration] = useState<string>();
  const [matchStatus, setMatchStatus] = useState<string>();
  const [participants, setParticipants] = useState<participants>();

  //convert queueID to respective queue type
  const idToQueueType: QueueTypeMap = {
    400: "Summoner's Rift Normal (Draft Pick)",
    420: "Ranked Solo/Duo Queue",
    430: "Summoner's Rift Normal (Blind Pick)",
    440: "Ranked Flex Queue",
    450: "ARAM"
  }
  //redirect to different player page
  const redirectPlayer = () => {

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
  //convert riotAPI game duration to minutes and seconds
  function convertRiotTimesDuration(riotTimesDuration) {
    // Calculate minutes and seconds
    const minutes = Math.floor(riotTimesDuration / 60);
    const seconds = Math.floor(riotTimesDuration % 60);
    // Format as a string in "minutes:seconds" format
    return `${minutes}min ${seconds < 10 ? '0' : ''}${seconds}sec`;
  } 

  useEffect(() => {
    setQueueType(idToQueueType[props.match.queueId]);
    setTimeDiff(calculateTimeDifference(props.match.gameEndTime));
    setTimeDuration(convertRiotTimesDuration(props.match.gameDuration));
    setParticipants(() => props.match.participants)
    setMatchStatus(() => {
      return props.match.matchStatus === true ? 'VICTORY' : 'DEFEAT';
    });
  },[props.match])

  return (
    <div className="card card-bordered w-96 bg-base-100 shadow-xl w-full">
      <div className="card-body flex-row">
        <div id="matchCard-start">
          <div>
            <h1>{queueType}</h1>
            <span>{timeDiff}</span>
          </div> 
          <hr className="w-1/2 mx-auto my-2 "/>
          <div className="">
            <h1 className="font-bold">{matchStatus}</h1>
            <span>{timeDuration}</span>
          </div>

        </div>
        <div id="matchCard-center">

        </div>
        <div className="grid grid-cols-2 gap-x-3 text-sm" id="matchCard-end">
          <ul id="blue">
            {participants?.blue.map((player, index) => (
              <li key={index} className="whitespace-nowrap">
                <button>
                  {player.name}
                </button>
              </li>
            ) )}
          </ul>
          <ul id="red" >
            {participants?.red.map((player, index) => (
              <li key={index} className="whitespace-nowrap">
                <button>
                  {player.name}
                </button>
              </li>
              ) )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MatchCard;