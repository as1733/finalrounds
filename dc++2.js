
var net = require('net');
var server=require('dgram').createSocket('udp4');
server.bind(1834);
server.on('message',function (msg, rinfo)  {
    console.log("recieved on udp4"+msg);
});

var client = new net.Socket();
client.connect({port:4112,host: 'localhost'}, function() {
    console.log('Connected');
    // client.write('$ValidateNick socketson|');
});
var nmdc_escape = function(str) {
    return (''+str).length ? (''+str).
    replace(/&/g,'&amp;').replace(/\|/g,'&#124;').replace(/\$/g,'&#36;') :
        ' ';
};

client.on('data', function(data) {
    data=""+data;
    var cmd = data.split(' ')[0];
    var rem = data.substr(cmd.length + 1);
    console.log(data);
    if(data.includes("+joinChat")){console.log("tussi great ho");};
    var t=nmdc_escape('cake by ocean');
    //console.log(rem);
    if(data.includes('$Lock')){console.log("Key wanted");
        var key=key_generate(rem);
        console.log(""+key);
        var query='$Supports NoGetINFO UserCommand UserIP2|'+'$Key '+key+'|'+'$ValidateNick '+'avsbot'+'|';
        client.write(query);
    }
    if(data.includes('$Hello') && data.includes('avsbot')){client.write('$GetNickList|');console.log("asking for nicklist");
        client.write('$MyINFO $ALL avsbot <,M:P,H:1/0/0,S:50000000000000>$ $10  $$0$||');

    }
    if(data.includes('$To: avsbot From: as1733 ')){
        client.write('$Search 192.168.118.25:1834 T?T?500000?1?'+'cake/%DCN036%/by'+'|');
        console.log(data);
        console.log();
        console.log("Search QUERY EXECUTED***");

    };


    //client.destroy(); // kill client after server's response
});

client.on('close', function() {
    console.log('Connection closed');
});

function SearchQuery(msg){
}



var key_generate = function(lock) {
   
    var bitschanger = function(bits) {
        return ((bits << 4) & 240) | ((bits >>> 4) & 15);
    };
    var charcor = function(b) {
        return (("..0.5.36.96.124.126.").indexOf("."+b+".") > 0) ?
        "/%DCN"+(0).toPrecision(4-b.toString().length).substr(2)+b+"%/" :
            String.fromCharCode(b)
            ;
    };

    var key = charcor(bitschanger(
        lock.charCodeAt(0) ^ lock.charCodeAt(-1) ^ lock.charCodeAt(-2) ^ 5
    ));
    for (var i=1; i<lock.length; i++) {
        key += charcor(bitschanger(lock.charCodeAt(i) ^ lock.charCodeAt(i - 1)));
    }
    return key;
};

