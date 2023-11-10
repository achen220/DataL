import { useEffect, useRef } from "react"
import * as d3 from "d3";

function PentagonalGraph (props) {
  const chartRef = useRef();
  
  useEffect(() => {
    // Clear the previous SVG if it exists
    d3.select(chartRef.current).selectAll('svg').remove();
    const svgLength: number = 800;
    const svg = d3.select(chartRef.current)
    .append('svg')
    .attr('width', svgLength)
    .attr('height', svgLength)
    .attr('margin-top', 100)
    //define dimension of chart

    for (let i = 0; i <= 4; i++) {
      const polygonlength: number = 500 - 100*i;
      const margin: number = (svgLength - polygonlength)/2;
      const halfFaceSize: number = polygonlength * Math.tan(36 * (Math.PI / 180)/2);
      const dropHeight: number = Math.sqrt(Math.pow((2*halfFaceSize),2) - Math.pow(polygonlength/2,2))
      const a = 2 * halfFaceSize
      // console.log(Math.sqrt(Math.pow(a,2) - Math.pow(length/2,2)))
      
      // console.log(halfFaceSize + "," + dropHeight)
      // Calculate the coordinates for the five points of the pentagon
      const coordinates:num[][] = [
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
  
      svg.append('path')
        .datum(coordinates)
        .attr('d', lineGenerator)
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 2);
        
      const labelData = [
        { x: polygonlength / 2 + margin, y: margin, label: "Offense" },
        { x: margin, y: dropHeight + margin, label: "Vision Score" },
        { x: (polygonlength / 2) - halfFaceSize + margin, y: polygonlength + margin + 25, label: "CS" },
        { x: (polygonlength / 2) + halfFaceSize + margin, y: polygonlength + margin + 25, label: "Death" },
        { x: polygonlength + margin, y: dropHeight + margin, label: "Kill Participation" },
      ];
      // Add labels to the points
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


  },[props.matchStats])
  return (
    <div ref={chartRef} className="m-auto">
    </div>
  )
}

export default PentagonalGraph;