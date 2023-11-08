
import { useSelector } from "react-redux";
import MatchCard from "./MatchCard";

function HistoryContainer (props:any) {
  const { summonerName } = useSelector((state) => state.currentPlayer)
  return(
    <section className="w-full">
      <h1> {summonerName} </h1>
      <h2 className="text-xl underline"> Match History </h2>
      <div className="w-full ">
        {(props.matchStats).map((match,index) => {
          return <MatchCard index={index} match={match}/>
        })
        }
      </div>
    </section>
  )
}

export default HistoryContainer;