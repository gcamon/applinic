
var ADJECTIVES = [
    'Abrasive', 'Brash', 'Callous', 'Daft', 'Eccentric', 'Fiesty', 'Golden',
    'Holy', 'Ignominious', 'Joltin', 'Killer', 'Luscious', 'Mushy', 'Nasty',
    'OldSchool', 'Pompous', 'Quiet', 'Rowdy', 'Sneaky', 'Tawdry',
    'Unique', 'Vivacious', 'Wicked', 'Xenophobic', 'Yawning', 'Zesty'
];

var FIRST_NAMES = [
    'Anna', 'Bobby', 'Cameron', 'Danny', 'Emmett', 'Frida', 'Gracie', 'Hannah',
    'Isaac', 'Jenova', 'Kendra', 'Lando', 'Mufasa', 'Nate', 'Owen', 'Penny',
    'Quincy', 'Roddy', 'Samantha', 'Tammy', 'Ulysses', 'Victoria', 'Wendy',
    'Xander', 'Yolanda', 'Zelda'
];

var LAST_NAMES = [
    'Anchorage', 'Berlin', 'Cucamonga', 'Davenport', 'Essex', 'Fresno',
    'Gunsight', 'Hanover', 'Indianapolis', 'Jamestown', 'Kane', 'Liberty',
    'Minneapolis', 'Nevis', 'Oakland', 'Portland', 'Quantico', 'Raleigh',
    'SaintPaul', 'Tulsa', 'Utica', 'Vail', 'Warsaw', 'XiaoJin', 'Yale',
    'Zimmerman'
];

var possible = "001122334455667788991122334455667788990012345678936855004492";
var specialChar = "!@#$%&()?"
var alphabets = "ABCDEFGHJKLMNPQRSTUVWXYZ"

function randomUsername() {
    function rando(arr) {
        return arr[Math.floor(Math.random()*arr.length)];
    }
    return rando(ADJECTIVES) + rando(FIRST_NAMES) + rando(LAST_NAMES);
}

function genRef(count) {
    var val;
    if(typeof count == 'number'){
        var text = "";
          for( var i=0; i < count; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
          val = parseInt(text);
    } else {
        val = Math.floor(Math.random() * 99999999);
    }

    return val;
} 

function genPassword(a,b,c){
    var text = "";
    for( var i=0; i < a; i++ )
        text += alphabets.charAt(Math.floor(Math.random() * alphabets.length));
    for(var j=0; j < b; j++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    for( var i=0; i < a; i++ )
        text += alphabets.charAt(Math.floor(Math.random() * alphabets.length));
    for(var k=0; k < c; k++)
        text += specialChar.charAt(Math.floor(Math.random() * specialChar.length));
    return text;
}

module.exports = {
    username: randomUsername,
    genRef : genRef,
    genPassword: genPassword
}