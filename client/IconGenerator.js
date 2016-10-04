import $ from 'jquery';

var icons = ['fa-anchor', 'fa-bell', 'fa-flash', 'fa-circle', 'fa-square', 'fa-leaf', 'fa-rocket', 'fa-sun-o', 'fa-moon-o', 'fa-tree'];
var numcolors = 12;  //12 icon colors specified in CSS


function getIcons(users, idea_id){
    var generatedIcons = [];
    var generate = seedgen({icon: icons.length, color: numcolors, aria_id: icons.length * numcolors});

     for(var i=0; i<users.length; i++){
        var iconData = generate(users[i] + " " + idea_id);
        generatedIcons.push({id: users[i], icon: icons[iconData.icon], color: "color" + (iconData.color + 1), aria_id: iconData.aria_id});
     }
    return generatedIcons;
}

export {getIcons}