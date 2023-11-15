import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux";
import Chart from 'chart.js/auto';




interface statsRanking {
  totalDamageDealt: number[],
  deaths: number[],
  killParticipation: number[],
  totalMinionsKilled: number[],
  visionScore: number[]
}

function PentagonalGraph (props) {
  const chartRef = useRef();
  const data = props.matchStats;
  const [position, setPosition] = useState<string>('overall');
  const { summonerName } = useSelector((state) => state.currentPlayer)

  useEffect(() => {
    const playerRank: statsRanking = {
      totalDamageDealt: [],
      deaths: [],
      killParticipation: [],
      totalMinionsKilled: [],
      visionScore: []
    }
    let sampleSize: number = 0;
    //rank player stats in all five category out of 10
    for (let i = 0; i < data.length; i++) {
      const currentMatch = data[i];
      //filtering based on position
      if (position !== 'overall' && currentMatch.playerPosition.toUpperCase() !== position.toUpperCase()) {
        continue;
      }    
      sampleSize++;  
      const combinedTeam = currentMatch.participants.blue.concat(currentMatch.participants.red);

      const stats: string[] = ['totalDamageDealt', 'deaths','killParticipation','totalMinionsKilled','visionScore'];
      
      //rank the player based on each stats
      for (let j = 0; j < stats.length; j++) {
        const currentStat:string = stats[j];
        let sortedPlayerStats;

        if (currentStat !== 'deaths') sortedPlayerStats = combinedTeam.toSorted((a,b) => a[currentStat]- b[currentStat]);
        else sortedPlayerStats = combinedTeam.toSorted((a,b) => b[currentStat]- a[currentStat]);

        // console.log(`sorted ${currentStat}:`, sortedPlayerStats)
        const rank = sortedPlayerStats.findIndex((player) => player.name.toUpperCase() === summonerName.toUpperCase()) + 1
        
        playerRank[currentStat].push(rank);
      } 
    }
    //calculate average score in each stats
    for (const stat in playerRank) {
      const total = playerRank[stat].reduce((acc:number,curr:number) => acc+=curr,0);
      //calculate how much points to give based on rank out of 10
      playerRank[stat] = (total/sampleSize);
    }
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
              min: 1, // Set the minimum value for the radial axis
              max: 10, // Set the maximum value for the radial axis
              stepSize: 1, // Set the step size
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
      </ul>
      <canvas className="w-full h-full" ref={chartRef}></canvas>
    </>

  )
}

export default PentagonalGraph;