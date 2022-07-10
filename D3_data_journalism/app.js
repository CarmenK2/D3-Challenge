//Set up chart area

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv").then(function (healthPovertyData) {

  // Step 1: Parse Data/Cast as numbers
  // ==============================
  healthPovertyData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([8.5, d3.max(healthPovertyData, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([3.5, d3.max(healthPovertyData, d => d.healthcare)])
    .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  // Step 5: Create Circles
  // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthPovertyData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15").attr("class", function (d) {
      return "stateCircle " + d.abbr;
    })
    .attr("fill", "lightblue")
    .attr("opacity", "0.75")

  // var toolTextTip = d3.tip()
  //   .attr("class", "d3-tip")
  //   .offset([80, -60])
  //   .html(function (d) {
  //     return (`${d.abbr}`);
  //   });

  // // Step 7: Create tooltip in the chart
  // // ==============================
  // chartGroup.call(toolTextTip);


  // Step 6: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Poverty %: ${d.poverty}<br>Healthcare %: ${d.healthcare}`);
    });

  // Step 7: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("mouseover", function (data) {
    d3.select(this)
      .transition()
      .duration(1000)
      .attr("r", 22)
      .attr("fill", "red")
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function (data, index) {
      d3.select(this)
        .transition()
        .duration(50)
        .attr("r", 15)
        .attr("fill", "lightblue")
      toolTip.hide(data);
    });

  // Trying to append text inside circle
  // const label = svg.append("g")
  //   .attr("font-family", "Yanone Kaffeesatz")
  //   .attr("font-weight", 700)
  //   .attr("text-anchor", "middle")
  //   .selectAll("text")
  //   .data(data)
  //   .join("text")
  //   .attr("id", "isoCode")
  //   .attr("opacity", 0)
  //   .attr("dy", "0.35em")
  //   .attr("x", d => d.x0)
  //   .attr("y", d => d.y0)
  //   .text(d => d.abbr);


  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Lack Healthcare (%)")
    .attr("text-anchor", "middle")
    .classed("active", true);


  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty (%)")
    .classed("active", true);
}).catch(function (error) {
  console.log(error);







});
