// function to graph a given set of points
function createPlot(data, plotSvg, xAxisUnits, yAxisUnits, width, height) {

  // add the x Axis
  const x = d3.scaleLinear()
    .domain(d3.extent(data.map(d => d[xAxisUnits])))
    .range([0, width]);
  plotSvg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

  // add the y Axis
  const y = d3.scaleLinear()
    .domain(d3.extent(data.map(d => d[yAxisUnits])))
    .range([height, 0]);
  plotSvg.append('g')
    .call(d3.axisLeft(y));

  // plot the curve
  plotSvg.append('path')
         .attr('class', 'mypath')
         .datum(data)
         .attr('fill', 'red')
         .attr('opacity', '.8')
         .attr('stroke', '#000')
         .attr('stroke-width', 1)
         .attr('stroke-linejoin', 'round')
         .attr('d', d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return x(d[xAxisUnits]); })
            .y(function(d) { return y(d[yAxisUnits]); })
         );

  // add endpoints so fill is even
  let oldPath = plotSvg.select('.mypath').attr('d');
  let newPath = oldPath + 'L' + width + ',' + height + 'L' + 0 + ',' + height
  plotSvg.select('.mypath')
    .attr('d', newPath);
}

// functions to compute density (TODO: necessary?)
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
