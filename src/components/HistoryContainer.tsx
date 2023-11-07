
import MatchCard from "./MatchCard";

function HistoryContainer (props:any) {
  return(
    <section className="w-full">
      <h1 className="text-xl underline"> Match History </h1>
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