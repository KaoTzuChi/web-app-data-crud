/* 
==============================================================================
Terminal 1
    $ sudo service docker start
    $ /.../myprojectfolder/docker-compose up
Terminal 2
    $ docker-compose exec database-service mongo -u "root" -p "123456789" --authenticationDatabase "admin"
    >> load("data/db/initial-database.js")
==============================================================================
*/

var conn=null;
var db=null;
var dbadmin=null;

try {
    conn = new Mongo("127.0.0.1:27017");
    print ('<< 1. mongo service: ok >>');
    try {
        dbadmin = conn.getDB("admin");
        dbadmin.auth( "root", "123456789" );
        db = dbadmin.getSiblingDB('mydatabase');
        print ('<< 2. connect to mydatabase: ok >>');

        // create a new user for later app accessing.
        try {   
            db.createUser({
                "user" : "myuser",
                "pwd" : "myuserspwd",
                "roles" : [
                    { "db" : "mydatabase", "role": "readWrite" },
                    { "db" : "mydatabase", "role": "dbAdmin" },
                    { "db" : "mydatabase", "role": "dbOwner" },
                    { "db" : "mydatabase", "role": "userAdmin" }
                ]
            });
            print ('<< 3. createuser: ok >>');
        } catch (e) {
            print ('<< 3. createuser: FAIL >>'+e);
        }

        // initialize mycollection, in mydatabase, by user root.
        try {
            db.createCollection("mycollection", { autoIndexId: true } );
            db.mycollection.remove({});
            db.mycollection.insertMany([
            { "field1": "valueof-doc1-field1", "field2":{"item1":"valueof-doc1-field2-item1", "item2":"valueof-doc1-field2-item2"}, "field3": new Date("2011-01-01 01:01:01+01:00"), "field4":1.01 },
            { "field1": "valueof-doc2-field1", "field2":{"item1":"valueof-doc2-field2-item1", "item2":"valueof-doc2-field2-item2"}, "field3": new Date("2012-02-02 02:02:02+02:00"), "field4":2.02 },
            { "field1": "valueof-doc3-field1", "field2":{"item1":"valueof-doc3-field2-item1", "item2":"valueof-doc3-field2-item2"}, "field3": new Date("2013-03-03 03:03:03+03:00"), "field4":3.03 },
            { "field1": "valueof-doc4-field1", "field2":{"item1":"valueof-doc4-field2-item1", "item2":"valueof-doc4-field2-item2"}, "field3": new Date("2014-04-04 04:04:04+04:00"), "field4":4.04 },
            { "field1": "valueof-doc5-field1", "field2":{"item1":"valueof-doc5-field2-item1", "item2":"valueof-doc5-field2-item2"}, "field3": new Date("2015-05-05 05:05:05+05:00"), "field4":5.05 },
            { "field1": "valueof-doc6-field1", "field2":{"item1":"valueof-doc6-field2-item1", "item2":"valueof-doc6-field2-item2"}, "field3": new Date("2016-06-06 06:06:06+06:00"), "field4":6.06 },
            { "field1": "valueof-doc7-field1", "field2":{"item1":"valueof-doc7-field2-item1", "item2":"valueof-doc7-field2-item2"}, "field3": new Date("2017-07-07 07:07:07+07:00"), "field4":7.07 },
            { "field1": "valueof-doc8-field1", "field2":{"item1":"valueof-doc8-field2-item1", "item2":"valueof-doc8-field2-item2"}, "field3": new Date("2018-08-08 08:08:08+08:00"), "field4":8.08 },
            { "field1": "valueof-doc9-field1", "field2":{"item1":"valueof-doc9-field2-item1", "item2":"valueof-doc9-field2-item2"}, "field3": new Date("2019-09-09 09:09:09+09:00"), "field4":9.09 }
            ]);
            print ('<< initialize mycollection: ok >>');
        } catch (e) {print ('<< initialize mycollection: FAIL >>'+e);}


    } catch (e) {
        print ('<< 2. connect to mydatabase: FAIL >>'+e);
    }
} catch (e) {
    print ('<< 1. mongo service: FAIL >>'+e);
}




