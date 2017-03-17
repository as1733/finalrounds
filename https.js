{
    {
        var https = require('https');
        var fs = require('fs');
        var WebSocket = require('ws').Server;
        var options = {
            key: fs.readFileSync('vedochat.key'),
            cert: fs.readFileSync('vedochat.cert')
        };
        var site = "Hello WORLD";
        fs.readFile('WorkPage.html', function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                site = data;
            }


        });

        var a = https.createServer(options, function (req, res) {


            res.writeHead(200);
            res.write(site.toString());
            res.end();
        });
        a.listen(1310, "172.16.83.21");
        var wss = new WebSocket({server: a});
        var users = {};
        var privatekey = {};
        // var userset1={aditya:"connection",vikram:"connection2"};
        //var userset2={maa:"connection3",dadu:"connection4",somaya:"connection5"};
        //var rooms={first:userset1,second:userset2};
        var rooms = {};
    }

    wss.on("connection", function (link) {
        console.log("Connected new user");
        var get = {action: "listofactive", roomnames: [], noofusers: []};
        for (var r in rooms) {
            if (Object.keys(rooms[r]).length > 0) {
                get.roomnames.push(r);
                get.noofusers.push(Object.keys(rooms[r]).length);
                console.log("Room name " + r);
            }
        }
        var replas = {action: "listofactive", roomsa: get};
        link.send(JSON.stringify(get));


        console.log(link._socket.remoteAddress);
        link.on("close", function (connection) {
                    var dissconnected=0;
            for (var x in rooms) {
                console.log("User in room " + x);
                var seta = {};
                for (var y in rooms[x]) {
                    console.log("");
                    if (rooms[x][y] != link) {
                        seta[y] = rooms[x][y];
                        console.log("SEE THIS "+x+"and this is y"+y);

                    }
                    else {dissconnected={action:"reomvedUser",roomname:x,username:y};
                        console.log("XXXXXXXXXXXXXXXXXXX USER DISSCONECTED XXXXXXXXXXXXXXXXXXXXXXX--" + dissconnected.roomname+"  "+dissconnected.username);
                    }
                }
                console.log("NEW ROOMS LIST ");
                if (rooms[x] != seta) {
                    rooms[x] = seta;
                    //console.log(rooms[x][y]);
                }


            }for (var activeuser in rooms[dissconnected.roomname])
            {rooms[dissconnected.roomname][activeuser].send(JSON.stringify(dissconnected));

            }


        });
        link.on("error", function (err) {
            console.log("Error Occured" + err);
        });
        link.on("message", function (data) {
            data = JSON.parse(data);
            if (data.action === "Create") {
                createRoom(data, link);
            }
            if (data.action === "joining") {
                joinroom(data, link)

            }
            if (data.action === "Offer") {
                console.log("Relaying offer from " + data.rootuser + " to " + data.remoteuser)
                rooms[data.rmid][data.remoteuser].send(JSON.stringify(data));
            }
            if (data.action === "answer") {
                rooms[data.rid][data.to].send(JSON.stringify(data));
            }
            if (data.action === "ice") {
                console.log("Relaying the ICE candidate from " + data.origin + " to " + data.destination);
                rooms[data.rid][data.destination].send(JSON.stringify(data));
            }
            if (data.action === "listofactive") {
                var get = {action: "listofactive", roomnames: [], noofusers: []};
                for (var r in rooms) {
                    if (Object.keys(rooms[r]).length > 0) {
                        get.roomnames.push(r);
                        get.noofusers.push(Object.keys(rooms[r]).length);
                        //console.log("Room name " + r);
                    }
                }
                var replas = {action: "listofactive", roomsa: get};
                link.send(JSON.stringify(get));
            }
            if(data.action==="chat")
            {
                for (var r in rooms){
                    if(r===data.room)
                    {for (var y in rooms[data.room])
                    {console.log("### "+y);
                        console.log(data)
                        var meta={action:"chat",userh:data.user,msg:data.msg}
                        rooms[r][y].send(JSON.stringify(meta));

                    }
                    }
                }
            }

        });
        /*  message wala cope*/


    });


    function createRoom(data, connection) {
        var status = 0;

        for (var x in rooms) {
            if (data.roomid === x && Object.keys(rooms[x]).length > 0) {
                status = -1;

                console.log("Already existing room");
                console.log("Status Y=" + status);
            }

        }
        ;
        if (status != -1) {
            var temp = {};

            temp["" + data.username] = connection;


            rooms["" + data.roomid] = temp;

            privatekey[data.roomid]=data.privacy;
            console.log("room "+data.roomid+" password is "+data.privacy);

            status = 1;
            console.log("Success in room creation Status Y=" + status);
        }
        ;
        console.log("Sending REply for room creation request " + data.roomid + "statust = " + status);
        reply = {action: "Create", execution: status};
        /* for(var x in rooms){
         console.log(x);
         };  room names*/
        connection.send(JSON.stringify(reply));

    }

    function joinroom(data, connection) {
        var roomstate = 1;//0 is neutral .1 means roomid wrong 2.means username already exists
        var usernamestate = 0;//0 is neutral .1 means roomid wrong 2.means username already exists
        var userlist = new Array();
        console.log("Executed joining the room query for room" + data.rid);
        for (var x in rooms) {
            if (x === data.rid) {
                roomstate = 0;
                console.log("we found the room" + data.rid);
                for (var y in rooms[x]) {
                    userlist.push(y);
                    if (y === data.username) {
                        usernamestate = 2;

                    }

                }
            }
        }
        if (roomstate === 0 && usernamestate === 0 && privatekey[data.rid]===data.privacy) {

            console.log("adding user " + data.username + "to the room " + data.rid);
            userlist.push(data.username);
            rooms[data.rid][data.username] = connection;
            // var userlist2send={action:"updateUserList",listOfUser:userlist}
            /* for(var test in rooms[data.rid])
             {rooms[data.rid][test].send(JSON.stringify(userlist2send));

             }
             */
        }
        else if (roomstate === 1) {
            console.log("room od was wrong");
        }
        else if (usernamestate === 2) {
            console.log("Nick in the room was taken");
        }else if(privatekey[data.rid]!=data.privacy)
        {console.log("Wrong Password");
            usernamestate=3;
        }
        console.log("These are connected " + JSON.stringify(userlist));
        var reply = {action: "joining", userstate: usernamestate, roomidstate: roomstate, listOfUser: userlist};
        console.log("Server Sending reply for joing request to user " + data.username);
        connection.send(JSON.stringify(reply));
    }
}

//code above is required for web direct access
// code below is Required for the dc implementation
/*#########################
* #########################
* #########################*/
/*{
    var open=require('open');

    var net = require('net');
    var server=require('dgram').createSocket('udp4');
    server.bind(1834);
    server.on('message',function (msg, rinfo)  {
        console.log("recieved on udp4"+msg);
    });

    var client = new net.Socket();
    client.connect({port:411,host: '192.168.110.222'}, function() {
        console.log('Connected with dc client , ready for dc connections');
        // client.write('$ValidateNick socketson|');
    });
    var nmdc_escape = function(str) {
        return (''+str).length ? (''+str).
        replace(/&/g,'&amp;').replace(/\|/g,'&#124;').replace(/\$/g,'&#36;') :
            ' ';
    };
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


    client.on('data', function(data) {
        data=""+data;
        var cmd = data.split(' ')[0];
        var rem = data.substr(cmd.length + 1);
        var username=data.slice(data.indexOf('<')+1,data.indexOf('>'));
        console.log(data);
        if(data.includes("+joinChat")){
            var temp="https://192.168.0.104:1310/params?name="+username+"&roomname="+data.slice(data.indexOf("+joinChat")+10,data.indexOf("|"));
            client.write("$To: "+username+" From: avsbot $<avsbot> "+temp+"|");
           // open(temp);
        };
        if(data.includes("+activeRooms")){
            var temp="\n* ";
            for (var x in rooms)
            {temp+="* "+x+" \n ";
             }

            client.write("$To: "+username+" From: avsbot $<avsbot> "+temp+"|");
             };
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
            client.write('$Search 192.168.108.25:1834 T?T?500000?1?'+'cake/%DCN036%/by'+'|');
            console.log(data);
            console.log();
            console.log("Search QUERY EXECUTED***");

        };

        //client.destroy(); // kill client after server's response
    });

    client.on('close', function() {
        console.log('Connection closed');
    });




}

    */