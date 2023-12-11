// use d3 to plot the data
"use client";

import { IDataPlot } from "@/types";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export default function Plot(params: {
  data: IDataPlot;
  description: string;
  maxValue: number;
}) {
  const { data } = params;
  // ref to svg
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // set the dimensions and margins of the graph

    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3
      .select(svgRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right + 100)
      .attr("height", height + margin.top + margin.bottom + 100)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // append the svg object to the body of the page

    // Add X axis
    const x = d3
      .scaleLinear()
      .domain([0, data.values.length])
      .range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear().domain([0, params.maxValue]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Add dots for each value of the data. the x value should be the index of the data
    svg
      .append("g")
      .selectAll("dot")
      .data(data.values)
      .enter()
      .append("rect")
      .attr("x", (d, i) => x(i))
      .attr("y", (d) => y(d))
      .attr("width", 2)
      .attr("height", (d) => height - y(d))
      .style("fill", "#69b3a2");

    // Add a title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .text(data.title)
      .style("fill", "#69b3a2")
      .style("font-size", 10);

    // Add X axis label... should be white and on the bottom
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", width / 2 + margin.left)
      .attr("y", height + margin.top + 20)
      .text(data.xlabel)
      .style("fill", "#69b3a2")
      .style("font-size", 12);

    // Y axis label:
    svg
      .append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left + 20)
      .attr("x", -margin.top - height / 2 + 80)
      .text(data.ylabel)
      .style("fill", "#69b3a2")
      .style("font-size", 12);
  }, [data, svgRef]);

  return (
    <div className="w-full h-fit h-[460px] md:h-[440px] flex flex-col space-y-3 md:space-y-0 md:flex-row mt-6">
      <svg id="plot" className="w-full h-full" ref={svgRef} />
      <div className="text-gray-400 md:mt-[200px]">{params.description}</div>
    </div>
  );
}
