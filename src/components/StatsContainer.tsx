import { useSelector } from "react-redux"
import PentagonalGraph from "./PentagonalGraph"

function StatsContainer (props) {
  const { summonerName } = useSelector((state) => state.currentPlayer)
  return (
    <div className="card w-1/2 bg-base-100 shadow-xl">
      <h1>{summonerName}</h1>
      <PentagonalGraph matchStats={props.matchStats}/>
    </div>
  )
}
export default StatsContainer