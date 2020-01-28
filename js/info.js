// functionality based on https://bl.ocks.org/rpruim/b794fdef503ca19a5d94213513eec6f1

// allows info circle to be clicked to leave info on page until clicked again
let clicked = false;

// handle events on info circle
d3.select('#info-circle')
    .on('mouseover', displayInfo)
    .on('click', function() {
        if (clicked) {
            hideInfo();
        } else {
            displayInfo();
        }
        clicked = !clicked;
    })
    .on('mouseleave', function() {
        if (!clicked) {
            hideInfo();
        }
    });

function displayInfo() {

    // display info text
    const info =
        'Input a function of variables X and Y to be plotted in 3D. ' +
        'Then input boundries on the X and Y values. ' +
        'Below the 3D plot there are conditional distributions at a fixed X and Y as well as marginal distributions.' +
        '</br></br>Utilizes the math.js evaluate functionality, so options include: ' +
        '+-*/ for basic operations, () for grouping, ^ for powers, log(x,b) for log base b, ' +
        'sin() for sine, cos() for cosine, tan() for tangent, pi and e for the constants, ' +
        'and much more (see <a target="_blank" href="https://mathjs.org/docs/expressions/syntax.html">math.js</a>).' +
        '</br></br>(Click the info icon to make this window stay visible.)';
    d3.select('#info-text')
        .html(info)
        .style('visibility', 'visible')
        .style('left', '410px')
        .style('top', '50px')
}

function hideInfo() {
    
    // hide info text
    d3.select('#info-text').style('visibility', 'hidden');
}