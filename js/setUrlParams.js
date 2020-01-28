// from https://html-online.com/articles/get-url-parameters-javascript/
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

// allows urls params to be manually entered like: https://interim-w82-hb.github.io/JMCDistributionVisualizer/?funcText=x+y&xMin=2&xMax=3&yMin=0&yMax=1&xChosen=2.3&yChosen=0.7
let urlVars = getUrlVars();
document.getElementById("x-min-input").value = urlVars['xMin'];
document.getElementById("x-max-input").value = urlVars['xMax'];
document.getElementById("z-min-input").value = urlVars['yMin'];
document.getElementById("z-max-input").value = urlVars['yMax'];
document.getElementById("chosen-x").value = urlVars['xChosen'];
document.getElementById("chosen-z").value = urlVars['yChosen'];
document.getElementById("function-input").value = urlVars['funcText'] || '';