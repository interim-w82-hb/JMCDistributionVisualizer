//Create test data
let testData = [];
for(let i = 0; i < 100; i++){
    testData[i] = {x: i, y: Math.pow((.1*i), 2)};
}
console.log(testData[3].x + ' ' + testData[3].y);

//Initialize graphic dimensions
const graphicGroup = d3.select('g#graphic');
const graphicHeight = 400;
const graphicWidth = 600;
const margin = {left: 30, right: 10, top: 80, bottom: 30};
const plotHeight = graphicHeight - (margin.top + margin.bottom);
const plotWidth = graphicWidth - (margin.left + margin.right);

//Set attributes
graphicGroup.select('svg#graph-container')
    .style('height', graphicHeight)
    .style('width', graphicWidth)
    .style('background-color', '#CCCCCC')
    .select('rect#plot')
    .style('height', plotHeight)
    .style('width', plotWidth)
    .style('x', margin.left)
    .style('y', margin.top)
    .style('fill', '#FFFFFF');
