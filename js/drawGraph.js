//Create test data
let testData = [];
for(let i = 0; i < 100; i++){
    testData[i] = {x: i, y: Math.pow((.1*i), 2)};
}

//Initialize graphic dimensions
const graphicHeight = 400;
const graphicWidth = 460;

// set the dimensions and margins of the plot
const margin = {top: 30, right: 30, bottom: 30, left: 50};
const plotWidth = graphicWidth - margin.left - margin.right;
const plotHeight = graphicHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
var plotSvg = d3.select("#graphic")
    .append("svg")
    .attr("width", plotWidth + margin.left + margin.right)
    .attr("height", plotHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

graphDensityPlot(testData, plotSvg, 'x', 'y', plotWidth, plotHeight);


// get the data
function graphDensityPlot(data, plotSvg, xAxisUnits, yAxisUnits, width, height) {
    // add the x Axis
    const x = d3.scaleLinear()
        .domain(d3.extent(data.map(d => d[xAxisUnits])))
        .range([0, width]);
    plotSvg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    const y = d3.scaleLinear()
        .domain([0, 0.1])
        .range([height, 0]);
    plotSvg.append("g")
        .call(d3.axisLeft(y)); 

        // Compute kernel density estimation
    const density = kde(kernelEpanechnikov(7), x.ticks(100))
        ( data.map(function(d){  return d[yAxisUnits]; }) )

        // Plot the area
    plotSvg.append("path")
        .attr("class", "mypath")
        .datum(density)
        .attr("fill", "#69b3a2")
        .attr("opacity", ".8")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("stroke-linejoin", "round")
        .attr("d",  d3.line()
        .curve(d3.curveBasis)
            .x(function(d) { return x(d[0]); })
            .y(function(d) { return y(d[1]); })
        );
    
    //Add endpoints so fill is even
    let oldPath = plotSvg.select(".mypath").attr('d');
    let newPath = oldPath + 'L'+width+','+height+'L'+0+','+height
    plotSvg.select('.mypath')
        .attr('d', newPath);
}

// Function to compute density
function kde(kernel, X) {
  return function(V) {
    return X.map(function(x) {
      return [x, d3.mean(V, function(v) { return kernel(x - v); })];
    });
  };
}
function kernelEpanechnikov(k) {
  return function(v) {
    return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
  };
}
