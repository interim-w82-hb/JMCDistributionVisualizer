function updateAll() {

    // receive necessary data from input fields
    let funcText = d3.select('#function-input').property('value') || '6x*y^2';
    let xMin = +d3.select('#x-min-input').property('value') || 0;
    if (xMin < 0) {
        xMin = 0;
    }
    let xMax = +d3.select('#x-max-input').property('value') || 1;
    if (xMax <= xMin) {
        xMax = xMin + 1;
    }
    let zMin = +d3.select('#z-min-input').property('value') || 0;
    if (zMin < 0) {
        zMin = 0;
    }
    let zMax = +d3.select('#z-max-input').property('value') || 1;
    if (zMax <= zMin) {
        zMax = zMin + 1;
    }
    let xChosen = xMin + (xMax - xMin) / 2;
    if (!(d3.select('#chosen-x').property('value') === '')) {
        xChosen = +d3.select('#chosen-x').property('value');
    }
    if (!((xMin <= xChosen) && (xChosen <= xMax))) {
        xChosen = xMin + (xMax - xMin) / 2;
    }
    let zChosen = zMin + (zMax - zMin) / 2;
    if (!(d3.select('#chosen-z').property('value') === '')) {
        zChosen = +d3.select('#chosen-z').property('value');
    }
    if (!((zMin <= zChosen) && (zChosen <= zMax))) {
        zChosen = zMin + (zMax - zMin) / 2;
    }

    // ensure that values in text input fields are set if they were defaults
    // https://www.w3schools.com/jsref/prop_text_value.asp
    document.getElementById("x-min-input").value = xMin;
    document.getElementById("x-max-input").value = xMax;
    document.getElementById("z-min-input").value = zMin;
    document.getElementById("z-max-input").value = zMax;
    document.getElementById("chosen-x").value = xChosen;
    document.getElementById("chosen-z").value = zChosen;
    document.getElementById("function-input").value = funcText;

    // allow uppercase or lowercase and switch y to z (since 3D code uses y for height and z for length)
    funcText = funcText.replace('Z', 'z').replace('Y', 'y').replace('X', 'x').replace('y', 'z');

    // update all plots on any submit button press
    draw3d(funcText, xMin, xMax, zMin, zMax);
    draw2dx(funcText, xMin, xMax, zMin, zMax, xChosen);
    draw2dz(funcText, xMin, xMax, zMin, zMax, zChosen);
}