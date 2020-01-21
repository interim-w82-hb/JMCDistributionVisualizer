// initialize graphic dimensions
const graphicHeight = 400;
const graphicWidth = 460;

// set the dimensions and margins of the plot
const margin = {top: 30, right: 30, bottom: 30, left: 50};
const plotWidth = graphicWidth - margin.left - margin.right;
const plotHeight = graphicHeight - margin.top - margin.bottom;

// defaults
const funcText = '3*(x^2)';
const xMin = 0;
const xMax = 1;

// plot default
//plotFunction();

function gatherData() {
    funcText = d3.select('#function-input').property('value');
    xMin = +d3.select('#x-min-input').property('value');
    xMax = +d3.select('#x-max-input').property('value');
}

function plotFunction() {

    // clear and redraw plot
    // https://stackoverflow.com/questions/14422198/how-do-i-remove-all-children-elements-from-a-node-and-then-apply-them-again-with
    d3.select('#two-d-graphic').selectAll('*').remove();
    plotSvg = d3.select('#two-d-graphic')
                .append('svg')
                .attr('width', plotWidth + margin.left + margin.right)
                .attr('height', plotHeight + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // convert input text to function
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
    for(let i = 0; i < numPoints+1; i++){
        funcData[i] = {x: xVal, y: func(xVal), yInt: math.integrate(func, xMin, xVal, 0.001)};
        xVal += scaleFactor;
    }
    console.log(funcData);
    
    createPlot(funcData, plotSvg, 'y', 'yInt', plotWidth, plotHeight);
}