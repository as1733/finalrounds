/**
 * Created by as1733 on 17-03-2017.
 */
var mongoclient=require('mongodb').MongoClient;
var mongo = require('mongodb');
var BSON = mongo.BSONPure;
;
var url='mongodb://192.168.118.21:27017';
mongoclient.connect(url,function(err,db){
  console.log("connected");

    ;
    var cursor=db.collection('Employee').find({_id:new mongo.ObjectID('58cb76822d7eec088401f614')});
    cursor.each(function(err,doc){
        console.log(doc);
    });


});