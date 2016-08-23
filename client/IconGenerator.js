import $ from 'jquery';

var icons = ['fa-anchor', 'fa-bell', 'fa-flash', 'fa-circle', 'fa-square', 'fa-play', 'fa-heart', 'fa-sun-o', 'fa-moon-o', 'fa-tree'];
var numcolors = 12;  //12 icon colors specified in CSS

//returns 'count' unique icon/color combinations
function getIcons(count){
    var generatedIcons = [];
    var iconStart = Math.floor(Math.random() * icons.length);
    var colorStart = Math.floor(Math.random() * numcolors);

    for(var i=0; i<count; i++){
        var colorClass = "color" + ((colorStart + i) % numcolors + 1);
        var iconClass = icons[((iconStart + i) % icons.length)];
        generatedIcons.push({icon: iconClass, color: colorClass});
    }
    return generatedIcons;
}

export {getIcons}