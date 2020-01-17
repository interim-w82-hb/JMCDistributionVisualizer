d3.select('#function-submit')
  .on('click', checkFunction);

function checkFunction() {
    console.log(d3.select('#function-input').property('value'));
}