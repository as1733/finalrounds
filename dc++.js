
/**
 * Created by AVI on 28-09-2016.
 */

var  nmdc=require("nmdc").Nmdc;
var hub=nmdc({address:"192.168.145.81"});
hub.onConnect=function(event) {
hub.say("???");
    console.log("Connected");
}

hub.onPrivate=function(username,msg){
    console.log(username+" ->"+ msg);
    hub.raw("<bitbot> recieved PM on it boss |","")
    // hub.raw("$Search bitbOt search_string|")


};
hub.onPublic=function(username,message){
    console.log(username+"->"+message);

}
var nmdc_escape = function(str) {
    return (''+str).length ? (''+str).
    replace(/&/g,'&amp;').replace(/\|/g,'&#124;').replace(/\$/g,'&#36;') :
        ' ';
};
/*
 hub.onCrude=function(data){console.log("GOOODJOB");
 console.log(data);};
 */
//hub.onhello=function(data){console.log("new user joined ->"+data);splitCommand(data)};
hub.nmdc_handle=function(data){
    console.log(data);
    var com=data.substring(1,data.indexOf(' '));
    var rem=data.substring(data.indexOf(' ')+1,data.length);
    console.log("rem== "+rem);
    console.log("Current Hub reply->"+com);
    switch(com)
    {case 'Lock': {
        var key = nmdc_locktokey(rem);
        hub.raw(
            '$Supports NoGetINFO UserCommand UserIP2|'+
            '$Key '+key+'|'+
            '$ValidateNick '+'bitbot'+'|'
        );

    }   break;
        case 'Hello': if(rem==='bitbot'){hub.raw('$GetNickList|');
            hub.raw('$MyINFO $ALL bitbot <,M:P,H:1/0/0,S:50000000000>$ $10  $$0$||');}
            hub.raw('$Search 192.168.118.25:1834 F?T?0?9?TTH:GZNQPQDWM2ZBP3KGCHOKV3AR2ZHULDWF4MB2CLI|');




    }
};
function splitCommand(string){
    s={};
    s="aditya";
    var command=string.substring(1,string.indexOf(' '));
    var restcommand=string.substring(string.indexOf(' ')+1,string.length);
    console.log("splittling in work "+command+"check space"+"Username is check sapce again"+restcommand);
    if(restcommand=="as1733")
    {hub.raw('$To: '+restcommand+' From: '+"bitbot"+' $<bitbot> '+
        nmdc_escape("HIY u recnnectede")+'|',function(){});

    }

};





/*
 var net = require('net');

 var client = new net.Socket();
 client.connect({port:4521}, function() {
 console.log('Connected');
 // client.write('$ValidateNick socketson|');
 });


 client.on('data', function(data) {
 data=""+data;
 var cmd = data.split(' ')[0];
 var rem = data.substr(cmd.length + 1);
 console.log(data);
 //console.log(rem);
 if(data.includes('$Lock')){console.log("Key wanted");
 var key=nmdc_locktokey(rem);

 var query='$Supports NoGetINFO UserCommand UserIP2|'+'$Key '+key+'|'+'$ValidateNick '+'avs'+'|';
 client.write(query);
 }
 if(data.includes('$Hello')){client.write('$MyINFO  test');console.log("asking for nicklist");}


 //client.destroy(); // kill client after server's response
 });

 client.on('close', function() {
 console.log('Connection closed');
 });



 */
var nmdc_locktokey = function(lock) {
    // Coded by Mardeg
    var nibbleswap = function(bits) {
        return ((bits << 4) & 240) | ((bits >>> 4) & 15);
    };
    var chr = function(b) {
        return (("..0.5.36.96.124.126.").indexOf("."+b+".") > 0) ?
        "/%DCN"+(0).toPrecision(4-b.toString().length).substr(2)+b+"%/" :
            String.fromCharCode(b)
            ;
    };

    var key = chr(nibbleswap(
        lock.charCodeAt(0) ^ lock.charCodeAt(-1) ^ lock.charCodeAt(-2) ^ 5
    ));
    for (var i=1; i<lock.length; i++) {
        key += chr(nibbleswap(lock.charCodeAt(i) ^ lock.charCodeAt(i - 1)));
    }
    return key;
};

