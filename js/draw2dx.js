// initialize graphic dimensions
const graphicHeight = 460;
const graphicWidth = 460;

// set the dimensions and margins of the plot
const margin = {top: 30, right: 30, bottom: 30, left: 50};
const plotWidth = graphicWidth - margin.left - margin.right;
const plotHeight = graphicHeight - margin.top - margin.bottom;

function draw2dx(funcText, xMin, xMax, zMin, zMax, xChosen) {

    // set constants
    const numPoints = 1000;
    const xRange = xMax - xMin;
    const zRange = zMax - zMin;

    // clear and redraw plot
    // https://stackoverflow.com/questions/14422198/how-do-i-remove-all-children-elements-from-a-node-and-then-apply-them-again-with
    d3.select('#two-d-graphics-x').selectAll('*').remove();
    plotCondSvg = d3.select('#two-d-graphics-x')
        .append('svg')
        .attr('width', plotWidth + margin.left + margin.right)
        .attr('height', plotHeight + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    plotMargSvg = d3.select('#two-d-graphics-x')
        .append('svg')
        .attr('width', plotWidth + margin.left + margin.right)
        .attr('height', plotHeight + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // compile text to function at given x
    const comp = math.compile(funcText);
    function funcAtX (xChosen) {
        return function(zVal) {return comp.evaluate({x: xChosen, z: zVal});}
    }

    const totalAreaCond = math.integrate(funcAtX(xChosen), zMin, zMax, 0.001);

    // compute integral of slice at given x
    function integralAtX(xVal) {
        return math.integrate(funcAtX(xVal), zMin, zMax, 0.001);
    }

    const totalAreaMarg = math.integrate(integralAtX, xMin, xMax);

    // gather points
    let funcData = [];
    const xScaleFactor = xRange / numPoints;
    const zScaleFactor = zRange / numPoints;
    let xVal = xMin;
    let zVal = zMin;
    for (let i = 0; i < numPoints+1; i++) {
        funcData[i] = {x: xVal, z: zVal, cond: funcAtX(xChosen)(zVal) * (1/totalAreaCond), marg: integralAtX(xVal) * (1/totalAreaMarg)};
        xVal += xScaleFactor;
        zVal += zScaleFactor;
    }

    createPlot(funcData, plotCondSvg, 'z', 'cond', plotWidth, plotHeight, 'Conditional at Fixed X', '#ff5050');
    createPlot(funcData, plotMargSvg, 'x', 'marg', plotWidth, plotHeight, 'Marginal as X Varies', '#ffcc00');
}

function createPlot(data, plotSvg, xAxisUnits, yAxisUnits, width, height, plotName, hexColor) {

    // add the x Axis
    const x = d3.scaleLinear()
        .domain(d3.extent(data.map(d => d[xAxisUnits])))
        .range([0, width]);
    plotSvg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x));

    // add the y Axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data.map(d => d[yAxisUnits]))])
        .range([height, 0]);
    plotSvg.append('g')
        .call(d3.axisLeft(y));

    // create title
    plotSvg.append('g')
        .append('text')
        .style('font-weight', 'bold')
        .attr('x', -10)
        .attr('y', -10)
        .text(plotName);

    // plot the curve
    plotSvg.append('path')
        .attr('class', 'mypath')
        .datum(data)
        .attr('fill', hexColor)
        .attr('opacity', '.8')
        .attr('stroke', '#000')
        .attr('stroke-width', 1)
        .attr('stroke-linejoin', 'round')
        .attr('d', d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return x(d[xAxisUnits]); })
            .y(function(d) { return y(d[yAxisUnits]); })
        );

    // create horizontal axis label
    plotSvg.append('g')
        .append('text')
        .style('font-weight', 'bold')
        .style('text-anchor', 'middle')
        .attr('x', width/2)
        .attr('y', height + 30)
        .text(xAxisUnits.replace('x', 'X').replace('z', 'Y'));

    // add endpoints so fill is even
    let oldPath = plotSvg.select('.mypath').attr('d');
    let newPath = oldPath + 'L' + width + ',' + height + 'L' + 0 + ',' + height
    plotSvg.select('.mypath')
        .attr('d', newPath);
}