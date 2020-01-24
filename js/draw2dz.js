function draw2dz() {

    // set constants
    const numPoints = 1000;
    const funcText2d = d3.select('#function-input').property('value').replace('y', 'z');
    const xMin = +d3.select('#x-min-input').property('value') || 0;
    const xMax = +d3.select('#x-max-input').property('value') || 1;
    const zMin = +d3.select('#z-min-input').property('value') || 0;
    const zMax = +d3.select('#z-max-input').property('value') || 1;
    const xRange = xMax - xMin;
    const zRange = zMax - zMin;
    const zChosen = +d3.select('#chosen-z').property('value') || zMax;

    // clear and redraw plot
    // https://stackoverflow.com/questions/14422198/how-do-i-remove-all-children-elements-from-a-node-and-then-apply-them-again-with
    d3.select('#two-d-graphics-z').selectAll('*').remove();
    plotCondSvg = d3.select('#two-d-graphics-z')
        .append('svg')
        .attr('width', plotWidth + margin.left + margin.right)
        .attr('height', plotHeight + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    plotMargSvg = d3.select('#two-d-graphics-z')
        .append('svg')
        .attr('width', plotWidth + margin.left + margin.right)
        .attr('height', plotHeight + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // compile text to function
    const comp = math.compile(funcText2d);
    function funcAtZ (zChosen) {
        return function(xVal) {return comp.evaluate({x: xVal, z: zChosen});}
    }
    
    const totalArea = math.integrate(funcAtZ(zChosen), xMin, xMax, 0.001);

    // gather points
    let funcData = [];
    const xScaleFactor = xRange / numPoints;
    const zScaleFactor = zRange / numPoints;
    let xVal = xMin;
    let zVal = zMin;
    for (let i = 0; i < numPoints+1; i++) {
        funcData[i] = {x: xVal, z: zVal, y: funcAtZ(zChosen)(xVal) * (1/totalArea), yInt: math.integrate(funcAtZ(zVal), xMin, xMax, 0.001)};
        xVal += xScaleFactor;
        zVal += zScaleFactor;
    }

    createPlot(funcData, plotCondSvg, 'x', 'y', plotWidth, plotHeight, 'Conditional at Fixed y:', '#6666ff');
    createPlot(funcData, plotMargSvg, 'z', 'yInt', plotWidth, plotHeight, 'Marginal as y Varies', '#00cc66');
}