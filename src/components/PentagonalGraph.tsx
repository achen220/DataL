import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux";
import Chart from 'chart.js/auto';
import PentagonalGraphAPI from "../componentsAPI/pentagonalGraphAPI"; 






function PentagonalGraph (props) {
  const chartRef = useRef();
  const data = props.matchStats;
  const [position, setPosition] = useState<string>('overall');
  const { summonerName } = useSelector((state) => state.currentPlayer);
  const championPool = {};
  // const displayChampion: any[]= [];
  const [displayChampion, setDisplayChampion] = useState<any[]>([])
  useEffect(() => {
    const playerRank = PentagonalGraphAPI.calculateAverageRank(data, summonerName, position)
    // console.log(playerRank)
    let chartInstance;
    //format data for chart js
    const chartData = {
      labels:['totalDamageDealt','survivability', 'killParticipation','totalMinionsKilled','visionScore'],
      datasets:[{
        label: position || 'overall',
        data: Object.values(playerRank),
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
      }]
    }
    if (chartRef && chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      chartInstance = new Chart(ctx, {
        type:'radar',
        data: chartData,
        options: {
          elements: {
            line: {
              borderWidth: 3
            }
          },
          scales: {
            r: {
              min: 0, // Set the minimum value for the radial axis
              max: 10, // Set the maximum value for the radial axis
              stepSize: 2, // Set the step size
            },
          },
        },
      })
    }
    return () => {
      chartInstance.destroy()
    }
  },[props.matchStats,position])
  return (
    <>
      <ul className="flex gap-x-10">
        <li className="inline">
          <button onClick={() => {setPosition("TOP")}} className="btn btn-active btn-neutral">Top</button>
        </li>
        <li className="inline">
          <button onClick={() => {setPosition("JUNGLE")}} className="btn btn-active btn-neutral">Jungle</button>
        </li>
        <li className="inline">
          <button onClick={() => {setPosition("MIDDLE")}} className="btn btn-active btn-neutral">Mid</button>
        </li>
        <li className="inline">
          <button onClick={() => {setPosition("BOTTOM")}} className="btn btn-active btn-neutral">ADC</button>
        </li>
        <li className="inline">
          <button onClick={() => {setPosition("UTILITY")}} className="btn btn-active btn-neutral">Support</button>
        </li>
        <li className="inline">
          <button onClick={() => {setPosition("overall")}} className="btn btn-active btn-neutral">Overall</button>
        </li>
      </ul>
      <ul>
      </ul>
      <canvas className="w-full h-full" ref={chartRef}>
      </canvas>

    </>

  )
}

export default PentagonalGraph;