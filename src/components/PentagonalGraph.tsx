import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux";
import Chart from 'chart.js/auto';
import PentagonalGraphAPI from "../componentsAPI/pentagonalGraphAPI"; 


function PentagonalGraph (props) {
  const chartRef = useRef();
  const data = props.matchStats;
  const [position, setPosition] = useState<null | string>('overall');
  const [champions, setChampions] = useState<null | string>(null);
  const [championsList, setChampionsList] = useState<string[]>([]);
  const { summonerName } = useSelector((state) => state.currentPlayer);
  const allRoles: string[] = ['TOP','JUNGLE','MIDDLE','BOTTOM','UTILITY'];
  const getChampions = PentagonalGraphAPI.specifyChampionBasedOnPosition;
  const getAvgRank = PentagonalGraphAPI.calculateAverageRank;

  useEffect(() => {
    if (position !== null) setChampionsList(getChampions(data,position))
    const playerRank = getAvgRank(data, summonerName, position, champions);
    
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
    //creation of chart data
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
  },[props.matchStats,position, champions])
  return (
    <>
      <ul className="flex gap-x-10">
        {
          allRoles.map((role) => (
            <li key={role} className="inline">
              <button onClick={() => {setPosition(role);
                setChampions(null);
                getChampions(data,position)}} className="btn btn-active btn-neutral">{role}</button>
            </li>            
          ))
        }
      </ul>
      <ul>
        {
          championsList.map((champ) => (
            <li key={champ} className="inline">
              <button onClick={() => {setChampions(champ);
              setPosition(null)}}
              className="btn btn-active btn-neutral">{champ}</button>
            </li>
          ))
        }
      </ul>
      <canvas ref={chartRef}>
      </canvas>

    </>

  )
}

export default PentagonalGraph;