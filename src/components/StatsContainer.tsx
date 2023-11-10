import PentagonalGraph from "./PentagonalGraph"

function StatsContainer (props) {
  return (
    <div className="card w-screen h-screen bg-base-100 shadow-xl">
      <PentagonalGraph matchStats={props.matchStats}/>
    </div>
  )
}
export default StatsContainer