var request = require('request');
var dcauth=function(username,password) {
var result=true;
var url='http://172.16.86.222:13000/login?nick='+username+"&password="+password+'&secret=pooooool';
   request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            responsefordcapi=JSON.parse(body);
            console.log("see this "+responsefordcapi["error"]);
            if(responsefordcapi["error"]==="incorrect password")
            {
                console.log('hi');
                result=false;

            }
            // Show the HTML for the Modulus homepage.

        }
    });
return result;
}
var get=dcauth("as1733","lenasovo");
console.log("get=="+get);

