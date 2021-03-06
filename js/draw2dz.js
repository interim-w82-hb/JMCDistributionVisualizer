function draw2dz(funcText, xMin, xMax, zMin, zMax, zChosen) {

    // set constants
    const numPoints = 1000;
    const xRange = xMax - xMin;
    const zRange = zMax - zMin;

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

    // compile text to function at given z
    const comp = math.compile(funcText);
    function funcAtZ (zChosen) {
        return function(xVal) {return comp.evaluate({x: xVal, z: zChosen});}
    }

    const totalAreaCond = math.integrate(funcAtZ(zChosen), xMin, xMax, 0.001);

    // compute integral of slice at given z
    function integralAtZ(zVal) {
        return math.integrate(funcAtZ(zVal), xMin, xMax, 0.001);
    }

    const totalAreaMarg = math.integrate(integralAtZ, xMin, xMax);

    // gather points
    let funcData = [];
    const xScaleFactor = xRange / numPoints;
    const zScaleFactor = zRange / numPoints;
    let xVal = xMin;
    let zVal = zMin;
    for (let i = 0; i < numPoints+1; i++) {
        funcData[i] = {x: xVal, z: zVal, cond: funcAtZ(zChosen)(xVal) * (1/totalAreaCond), marg: integralAtZ(zVal) * (1/totalAreaMarg)};
        xVal += xScaleFactor;
        zVal += zScaleFactor;
    }

    createPlot(funcData, plotCondSvg, 'x', 'cond', plotWidth, plotHeight, 'Conditional at Fixed Y', '#6666ff');
    createPlot(funcData, plotMargSvg, 'z', 'marg', plotWidth, plotHeight, 'Marginal as Y Varies', '#00cc66');
}