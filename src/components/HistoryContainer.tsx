
import MatchCard from "./MatchCard";

function HistoryContainer () {
  return(
    <section className="w-1/2 ">
      <h1 className="text-xl underline"> Match History </h1>
      <div className="w-full ">
        <MatchCard />
      </div>
    </section>
  )
}

export default HistoryContainer;