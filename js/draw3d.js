// 3d code modeled after https://bl.ocks.org/Niekes/e920c03edd7950578b8a6cded8b5a1a5
// and https://bl.ocks.org/Niekes/1c15016ae5b5f11508f92852057136b5

const width = 720;
const height = 720;

// plot function when submitted
function draw3d(funcText, xMin, xMax, zMin, zMax) {

    d3.select('#three-d-graphic').select('svg').remove();
    d3.select('#three-d-graphic').append('svg').attr('id', 'dim-plot').attr('width', width).attr('height', height);
    const xRange = xMax - xMin;
    const zRange = zMax - zMin;
    var origin = [width/2, height/2], j = 10, points = [], base = [], yLine = [], alpha = 0, beta = 0, startAngle = Math.PI/4;
    var svg = d3.select('#dim-plot').call(d3.drag().on('drag', dragged).on('start', dragStart).on('end', dragEnd)).append('g');
    var mx, my, mouseX, mouseY;
    const maxRange = Math.max(xRange, zRange);
    const imgScale = 250 / maxRange;
    const xShift = xRange/2;
    const zShift = zRange/2;

    const xScale = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([0, xRange]);

    const zScale = d3.scaleLinear()
        .domain([zMin, zMax])
        .range([0, zRange]);

    var baseSurface = d3._3d()
        .scale(imgScale)
        .x(function(d){ return d.x - xShift; })
        .y(function(d){ return d.y; })
        .z(function(d){ return d.z - zShift; })
        .origin(origin)
        .rotateY(startAngle)
        .rotateX(-startAngle)
        .shape('SURFACE', 21);
    
    var surface = d3._3d()
        .scale(imgScale)
        .x(function(d){ return d.x - xShift; })
        .y(function(d){ return d.y; })
        .z(function(d){ return d.z - zShift; })
        .origin(origin)
        .rotateY(startAngle)
        .rotateX(-startAngle)
        .shape('SURFACE', 21);

    var yAxis3d = d3._3d()
        .shape('LINE_STRIP')
        .origin(origin)
        .rotateY(startAngle)
        .rotateX(-startAngle)
        .scale(imgScale);

    var xAxis3d = d3._3d()
        .shape('LINE_STRIP')
        .origin(origin)
        .rotateY(startAngle)
        .rotateX(-startAngle)
        .scale(imgScale);

    var zAxis3d = d3._3d()
        .shape('LINE_STRIP')
        .origin(origin)
        .rotateY(startAngle)
        .rotateX(-startAngle)
        .scale(imgScale);
    
    var color = d3.scaleLinear();
    
    function processData(data, planeClass, tt){
        
        // display the input function
        var planes = svg.selectAll('path.' + planeClass).data(data, function(d){ return d.plane; });
    
        planes
            .enter()
            .append('path')
            .attr('class', planeClass)
            .attr('fill', colorize)
            .attr('opacity', 0)
            .attr('stroke-opacity', 0.1)
            .merge(planes)
            .attr('stroke', 'black')
            .transition().duration(tt)
            .attr('opacity', 1)
            .attr('fill', colorize)
            .attr('d', surface.draw);
    
        planes.exit().remove();
    
        d3.selectAll('.' + planeClass).sort(surface.sort);
    }
    
    function processBaseData(data, planeClass, tt){
        
        // display the base
        var planes = svg.selectAll('path.' + planeClass).data(data, function(d){ return d.plane; });
    
        planes
            .enter()
            .append('path')
            .attr('class', planeClass)
            .attr('fill', colorize)
            .attr('opacity', 0)
            .attr('stroke-opacity', 0.1)
            .merge(planes)
            .attr('stroke', 'black')
            .transition().duration(tt)
            .attr('opacity', 0.5)
            .attr('fill', 'grey')
            .attr('d', baseSurface.draw);
    
        planes.exit().remove();
    
        d3.selectAll('.' + planeClass).sort(baseSurface.sort);
    }

    function processYAxisData(data) {

        // y-Scale
        var yAxis = svg.selectAll('path.yAxis').data(data);

        yAxis
            .enter()
            .append('path')
            .attr('class', '_3d yAxis')
            .merge(yAxis)
            .attr('stroke', 'black')
            .attr('stroke-width', .5)
            .attr('d', yAxis3d.draw);

        yAxis.exit().remove();

        // y-Scale text
        var yText = svg.selectAll('text.yText').data(data[0]);

        yText
            .enter()
            .append('text')
            .attr('class', '_3d yText')
            .attr('dx', '.3em')
            .attr('text-anchor', 'end')
            .merge(yText)
            .each(function(d){
                d.centroid = {x: d.rotated.x, y: d.rotated.y, z: d.rotated.z};
            })
            .attr('x', function(d){ return d.projected.x; })
            .attr('y', function(d){ return d.projected.y - 15; })
            .text(function(d){ return d[3]; });

        yText.exit().remove();

        d3.selectAll('._3d').sort(d3._3d().sort);
    } 
    
    function processXAxisData(data) {

        // x-scale
        var xAxis = svg.selectAll('path.xAxis').data(data);

        xAxis
            .enter()
            .append('path')
            .attr('class', '_3d xAxis')
            .merge(xAxis)
            .attr('stroke', 'black')
            .attr('stroke-width', .5)
            .attr('d', xAxis3d.draw);

        xAxis.exit().remove();

        // x-Scale text
        var xText = svg.selectAll('text.xText').data(data[0]);

        xText
            .enter()
            .append('text')
            .attr('class', '_3d xText')
            .attr('dx', '.3em')
            .attr('text-anchor', 'end')
            .merge(xText)
            .each(function(d){
                d.centroid = {x: d.rotated.x, y: d.rotated.y, z: d.rotated.z};
            })
            .attr('x', function(d){ return d.projected.x; })
            .attr('y', function(d){ return d.projected.y + 15; })
            .text(function(d){ return d[3]; });

        xText.exit().remove();

        d3.selectAll('._3d').sort(d3._3d().sort);
    } 
    function processZAxisData(data) {

        // z-Scale
        var zAxis = svg.selectAll('path.zAxis').data(data);

        zAxis
            .enter()
            .append('path')
            .attr('class', '_3d yAxis')
            .merge(zAxis)
            .attr('stroke', 'black')
            .attr('stroke-width', .5)
            .attr('d', zAxis3d.draw);

        zAxis.exit().remove();

        // z-Scale text
        var zText = svg.selectAll('text.zText').data(data[0]);

        zText
            .enter()
            .append('text')
            .attr('class', '_3d zText')
            .attr('dx', '.3em')
            .attr('text-anchor', 'end')
            .merge(zText)
            .each(function(d){
                d.centroid = {x: d.rotated.x, y: d.rotated.y, z: d.rotated.z};
            })
            .attr('x', function(d){ return d.projected.x; })
            .attr('y', function(d){ return d.projected.y + 15; })
            .text(function(d){ return d[3]; });

        zText.exit().remove();

        d3.selectAll('._3d').sort(d3._3d().sort);
    } 

    function colorize(d){
        var _y = (d[0].y + d[1].y + d[2].y + d[3].y)/4;
        return d.ccw ? d3.interpolateSpectral(color(_y)) : d3.color(d3.interpolateSpectral(color(_y))).darker(2.5);
    }
    
    function dragStart(){
        mx = d3.event.x;
        my = d3.event.y;
    }
    
    function dragged(){
        mouseX = mouseX || 0;
        mouseY = mouseY || 0;
        beta   = (d3.event.x - mx + mouseX) * Math.PI / 230 ;
        alpha  = (d3.event.y - my + mouseY) * Math.PI / 230  * (-1);
        processData(surface.rotateY(beta + startAngle).rotateX(alpha - startAngle)(points), 'surface', 0);
        processBaseData(baseSurface.rotateY(beta + startAngle).rotateX(alpha - startAngle)(base), 'base', 0);
        processYAxisData(yAxis3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)([yLine]));
        processXAxisData(xAxis3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)([xLine]));
        processZAxisData(zAxis3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)([zLine]));
    }
    
    function dragEnd(){
        mouseX = d3.event.x - mx + mouseX;
        mouseY = d3.event.y - my + mouseY;
    }
    
    function defineSurface(eq){

        // define points of function without yScale
        points = [];
        const overshootZ = zMax + 0.5*(zRange / 20);
        const overshootX = xMax + 0.5*(xRange / 20)
        for(var z = zMin; z < overshootZ; z += zRange / 20){
            for(var x = xMin; x < overshootX; x += xRange / 20){d3.range(-1, 11, 1).forEach(function(d){ yLine.push([-j, -d, -j]); });
                points.push({x: x, y: eq(x, z), z: z});
            }
        }

        const yMin = d3.min(points.map(d => d.y));
        const yMax = d3.max(points.map(d => d.y));
        const yRange = yMax - Math.min(yMin, 0);

        const yScale = d3.scaleLinear()
            .domain([0, yMax])
            .range([0, maxRange]);
            
    
        // define points of function with yScale
        points = [];
        for(var z = zMin; z < overshootZ; z += zRange / 20){
            for(var x = xMin; x < overshootX; x += xRange / 20){
                points.push({x: xScale(x), y: -yScale(eq(x, z)), z: zScale(z)});  // negative prevents upsidown graph
            }
        }
    
        // define points of base
        base = [];
        for(var z = zMin; z < overshootZ; z += zRange / 20){
            for(var x = xMin; x < overshootX; x += xRange / 20){
                base.push({x: xScale(x), y: yScale(0), z: zScale(z)});
            }
        }

        // define y scale
        yLine = [];
        d3.range(Math.min(yMin, 0), yMax+0.5*(yRange/5), yRange/5).forEach(function(d){ yLine.push([-xShift, -yScale(Math.round(d * 10) / 10), -zShift, Math.round(d * 10) / 10]); });

        // define x scale
        xLine = [];
        d3.range(xMin, xMax+0.5*(xRange/5), xRange/5).forEach(function(d){ xLine.push([xScale(Math.round(d * 10) / 10) - xShift, 0, -zShift, Math.round(d * 10) / 10]); });


        // define z scale
        zLine = [];
        d3.range(zMin, zMax+0.5*(zRange/5), zRange/5).forEach(function(d){ zLine.push([-xShift, 0, zScale(Math.round(d * 10) / 10) - zShift, Math.round(d * 10) / 10]); });

        // display the base and function surfaces
        color.domain([-yScale(yMax), -yScale(yMin)]);
        processData(surface(points), 'surface', 0);
        processBaseData(baseSurface(base), 'base', 0);
        processYAxisData(yAxis3d([yLine]));
        processXAxisData(xAxis3d([xLine]));
        processZAxisData(zAxis3d([zLine]));
    }
    
    function change(){

        // submit the entered function
        const comp = math.compile(funcText);
        function eqa (xVal, zVal) {
            return comp.evaluate({x: xVal, z: zVal});
        }
        defineSurface(eqa);
    }
    
    d3.selectAll('button').on('click', change);
    
    change();
}