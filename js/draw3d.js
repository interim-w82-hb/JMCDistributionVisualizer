// 3d code modeled after https://bl.ocks.org/Niekes/e920c03edd7950578b8a6cded8b5a1a5
// very WIP

// plot function when submitted
//d3.select('#function-submit')
//  .on('click', draw3d);

function draw3d() {

    d3.select('#three-d-graphic').select('svg').remove();
    d3.select('#three-d-graphic').append('svg').attr('id', 'dim-plot').attr('width', '960').attr('height', '960');
    let funcText3d = d3.select('#function-input').property('value').replace('y', 'z');
    let xMin = +d3.select('#x-min-input').property('value') || 0;
    let xMax = +d3.select('#x-max-input').property('value') || 20;
    let zMin = +d3.select('#z-min-input').property('value') || 0;
    let zMax = +d3.select('#z-max-input').property('value') || 20;
    let xRange = xMax - xMin;
    let zRange = zMax - zMin;
    var origin = [480, 480], j = 10, points = [], base = [], alpha = 0, beta = 0, startAngle = Math.PI/4;
    var svg = d3.select('#dim-plot').call(d3.drag().on('drag', dragged).on('start', dragStart).on('end', dragEnd)).append('g');
    var mx, my, mouseX, mouseY;
    let imgScale = 250 / Math.max(xRange, zRange);

    const xScale = d3.scaleLinear()
        .domain([xMin, xMax])
        .range([0, xRange]);

    const zScale = d3.scaleLinear()
        .domain([zMin, zMax])
        .range([0, zRange]);
    
    var baseSurface = d3._3d()
        .scale(imgScale)
        .x(function(d){ return d.x; })
        .y(function(d){ return d.y; })
        .z(function(d){ return d.z; })
        .origin(origin)
        .rotateY(startAngle)
        .rotateX(-startAngle)
        .shape('SURFACE', j*2);
    
    var surface = d3._3d()
        .scale(imgScale)
        .x(function(d){ return d.x; })
        .y(function(d){ return d.y; })
        .z(function(d){ return d.z; })
        .origin(origin)
        .rotateY(startAngle)
        .rotateX(-startAngle)
        .shape('SURFACE', j*2);
    
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
    }
    
    function dragEnd(){
        mouseX = d3.event.x - mx + mouseX;
        mouseY = d3.event.y - my + mouseY;
    }
    
    function defineSurface(eq){
    
        // define points of function
        points = [];
        for(var z = zMin; z < zMax; z += zRange / 20){
            for(var x = xMin; x < xMax; x += xRange / 20){
                points.push({x: xScale(x), y: -eq(x, z), z: zScale(z)});  // negative prevents upsidown graph
            }
        }
    
        var yMin = d3.min(points, function(d){ return d.y; });
        var yMax = d3.max(points, function(d){ return d.y; });
    
        // define points of base
        base = [];
        for(var z = zMin; z < zMax; z += zRange / 20){
            for(var x = xMin; x < xMax; x += xRange / 20){
                base.push({x: xScale(x), y: 0, z: zScale(z)});
            }
        }
    
        // display the base and function surfaces
        color.domain([yMin, yMax]);
        processData(surface(points), 'surface', 1000);
        processBaseData(baseSurface(base), 'base', 1000);
    }
    
    function change(){

        // submit the entered function
        const comp = math.compile(funcText3d);
        function eqa (xVal, zVal) {
            return comp.evaluate({x: xVal, z: zVal});
        }
        defineSurface(eqa);
    }
    
    d3.selectAll('button').on('click', change);
    
    change();
}