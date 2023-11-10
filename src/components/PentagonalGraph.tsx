import { useEffect, useRef } from "react"
import { useSelector } from "react-redux";
import * as d3 from "d3";


interface statsRanking {
  totalDamageDealt: number[],
  death: number[],
  killParticipation: number[],
  totalMinionsKilled: number[],
  visionScore: number[]
}

function PentagonalGraph (props) {
  const chartRef = useRef();
  const data = props.matchStats;
  const { summonerName } = useSelector((state) => state.currentPlayer)
    useEffect(() => {
    // Clear the previous SVG if it exists
    d3.select(chartRef.current).selectAll('svg').remove();
    //create svg containing graph
    const svgLength: number = 800;
    const svg = d3.select(chartRef.current)
    .append('svg')
    .attr('width', svgLength)
    .attr('height', svgLength)
    .attr('margin-top', 100)
    //creation of All layers of pentagon
    for (let i = 0; i <= 5; i++) {
      //defining dimensions of graph
      const polygonlength: number = 600 - 100*i;
      //margin to ensure centering of svg
      const margin: number = (svgLength - polygonlength)/2;
      //defining variable to calculate position of each point of the pentagon
      const halfFaceSize: number = polygonlength * Math.tan(36 * (Math.PI / 180)/2);
      const dropHeight: number = Math.sqrt(Math.pow((2*halfFaceSize),2) - Math.pow(polygonlength/2,2))
      // Calculate the coordinates for the five points of the pentagon
      const coordinates:number[][] = [
        [polygonlength/2+margin, margin],
        [margin,dropHeight + margin],
        [(polygonlength/2) - halfFaceSize + margin, polygonlength
        +margin],
        [(polygonlength/2) + halfFaceSize + margin, polygonlength+margin],
        [polygonlength + margin,dropHeight + margin],
        [polygonlength/2+margin, margin]
      ];
      // Create a path based on the calculated coordinates
      const lineGenerator = d3.line()
      .x(d => d[0])
      .y(d => d[1]);
      //inside svg overlap the pentagon svg
      svg.append('path')
        .datum(coordinates)
        .attr('d', lineGenerator)
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 2);
      // create and add labels to the points
      const labelData = [
        { x: polygonlength / 2 + margin, y: margin, label: "Offense" },
        { x: margin, y: dropHeight + margin, label: "Vision Score" },
        { x: (polygonlength / 2) - halfFaceSize + margin, y: polygonlength + margin + 25, label: "CS" },
        { x: (polygonlength / 2) + halfFaceSize + margin, y: polygonlength + margin + 25, label: "Death" },
        { x: polygonlength + margin, y: dropHeight + margin, label: "Kill Participation" },
      ];

      svg.selectAll('text')
        .data(labelData)
        .enter()
        .append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .text(d => d.label)
        .attr('font-size', 16)
        .attr('text-anchor', 'middle')
        .attr('dy', -10); // Adjust the vertical position of the labels as needed
    }

    const playerRank: statsRanking = {
      totalDamageDealt: [],
      death: [],
      killParticipation: [],
      totalMinionsKilled: [],
      visionScore: []
    }
    //rank player stats in all five category out of 10
    for (let i = 0; i < data.length; i++) {
      const currentMatch = data[i];

      const combinedTeam = currentMatch.participants.blue.concat(currentMatch.participants.red);

      const stats: string[] = ['totalDamageDealt', 'death','killParticipation','totalMinionsKilled','visionScore'];
      
      for (let j = 0; j < stats.length; j++) {
        const currentStat:string = stats[j];
        let sortedPlayerStats;

        if (currentStat !== 'death') sortedPlayerStats = combinedTeam.toSorted((a,b) => a[currentStat]- b[currentStat]);
        else sortedPlayerStats = combinedTeam.toSorted((a,b) => b[currentStat]- a[currentStat]);

        // console.log(`sorted ${currentStat}:`, sortedPlayerStats)
        const damageRank = sortedPlayerStats.findIndex((player) => player.name.toUpperCase() === summonerName.toUpperCase()) + 1
        
        playerRank[currentStat].push(damageRank);
      } 
    }
    console.log("ranking:", playerRank)
  },[props.matchStats])
  return (
    <>
      <h1>{summonerName}</h1>
      <div ref={chartRef} className="m-auto">
      </div>
    </>

  )
}

export default PentagonalGraph;