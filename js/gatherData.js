// plot function when submitted
d3.select('#function-submit')
  .on('click', plotFunction);

function plotFunction() {

    // clear and redraw plot
    // https://stackoverflow.com/questions/14422198/how-do-i-remove-all-children-elements-from-a-node-and-then-apply-them-again-with
    d3.select("#graphic").selectAll("*").remove();
    plotSvg = d3.select("#graphic")
                .append("svg")
                .attr("width", plotWidth + margin.left + margin.right)
                .attr("height", plotHeight + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // convert input text to function
    const funcText = d3.select('#function-input').property('value');
    const xMin = d3.select('#x-min-input').property('value');
    const xMax = d3.select('#x-max-input').property('value');
    const comp = math.compile(funcText);
    function func (val) {
        return comp.evaluate({x: val});
    }

    // create test data
    let funcData = [];
    const domainSize = xMax - xMin;
    const numPoints = 100;
    const scaleFactor = domainSize / numPoints;
    let xVal = xMin;
    for(let i = 0; i < numPoints; i++){
        funcData[i] = {x: xVal, y: func(xVal), yInt: math.integrate(func, xMin, xVal)};
        xVal += scaleFactor;
    }
    console.log(funcData);
    
    createDensityPlot(funcData, plotSvg, 'y', 'yInt', plotWidth, plotHeight);
}

// TODO: replace the functions in drawGraph with this?
function createDensityPlot(data, plotSvg, xAxisUnits, yAxisUnits, width, height) {

    // add the x Axis
    const x = d3.scaleLinear()
                .domain(d3.extent(data.map(d => d[xAxisUnits])))
                .range([0, width]);
    plotSvg.append("g")
           .attr("transform", "translate(0," + height + ")")
           .call(d3.axisBottom(x));

    // add the y Axis
    const y = d3.scaleLinear()
                .domain(d3.extent(data.map(d => d[yAxisUnits])))
                .range([height, 0]);
    plotSvg.append("g")
           .call(d3.axisLeft(y));

    // Plot the curve
    plotSvg.append("path")
           .attr("class", "mypath")
           .datum(data)
           .attr("fill", "transparent")
           .attr("opacity", ".8")
           .attr("stroke", "#000")
           .attr("stroke-width", 1)
           .attr("stroke-linejoin", "round")
           .attr("d",  d3.line()
                         .curve(d3.curveBasis)
                         .x(function(d) { return x(d[xAxisUnits]); })
                         .y(function(d) { return y(d[yAxisUnits]); })
           );
}