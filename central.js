//various config things
const express = require('express');
const path = require('path');
const re = require('re2');
const app = express();
const port = 23456;
var bodyParser = require('body-parser');
const { register } = require('module');
const hw5Directory = path.join(__dirname, '');


function lastOne(inArr,time) {
    let processedArr = [];
    for(let i = 0; i<inArr.length;i++) {
        if(inArr[i][1] == ':') {
            processedArr.push((Number(inArr[i][0])*60)+(Number(inArr[i][2])*10)+(Number(inArr[i][3])*1)+(Number(inArr[i][5])*.1)+(Number(inArr[i][6])*.01))
        }
        else if (inArr[i][2] == ':') {
            processedArr.push((Number(inArr[i][0])*600)+(Number(inArr[i][1])*60)+(Number(inArr[i][3])*10)+(Number(inArr[i][4])*1))
        }
        else if (inArr[i][1] == '.') {
            processedArr.push((Number(inArr[i][0]))+(Number(inArr[i][2])*.1)+(Number(inArr[i][3])*.01))
        }
        else {
            processedArr.push((Number(inArr[i][0])*10)+(Number(inArr[i][1])*1)+(Number(inArr[i][3])*.1)+(Number(inArr[i][4])*.01))
        }
    }
    processedArr.sort(function(a, b){return a - b});
    //now we have to find the percentile
    let i = 0;
    while(time > processedArr[i]) {
        i += 1;
    }
    console.log(i/processedArr.length);
    return(i/processedArr.length);



}

app.use("/", express.static(hw5Directory));

app.listen(port, function (error) {
    if (error) throw error;
    console.log("Server created Successfully");
});
app.get('/', (req,res) => {
    var index = hw5Directory + 'index.html';
    res.send(index)
});
app.get('/Athletes.html', (req,res) => {
    var index = hw5Directory + 'Athletes.html';
    res.send(index)
});
//Now, why the !@#$ do I need to include this? Spent 3 hrs looking for this line...
app.use(bodyParser.json());
app.post('/ath_id', (req,res) => {
    //m or p is 0 if m
    if(req.body.morp == 0) {
        //Mongo configs:
        const { MongoClient } = require('mongodb');
        const uri = "mongodb://127.0.0.1/lsgordon";
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        async function queryMongo(){
            try {
                await client.connect();
                //querying mongo
                const x1 = await client.db().collection('Race_record_final').find({'athlete.name':req.body.ath_id}).toArray();
                //console.log(x1);
                res.send(x1);
            }
            catch(e) {
                console.error(e);
            }
            finally {
                await client.close;
            }
        }
        queryMongo()
    }
    else {
        try {
            //pg configs
            const { Client } = require('pg');
            const client = new Client({
                user: 'lsgordon_123',
                password: '12345678',
                port: '5432',
                host: 'localhost',
                database: 'lsgordon'
            });
            let qstr = `SELECT * FROM Race_record 
                        INNER JOIN Athletes on Race_record.ath_id=Athletes.ath_id
                        INNER JOIN Teams on Teams.team_id=Race_record.team_id
                        INNER JOIN Meets on Meets.meet_id=Race_record.meet_id 
                        WHERE Athletes.name =` + `'` + [req.body.ath_id] + `'`;
            client.connect().then(() => {
                client.query(qstr, (err,res1) => {
                    if (err) {
                        console.error('bad things happen' +'\n' + err);
                    }
                    else {
                        x1 = res1.rows;
                        res.send(x1);

                    }
                })
            })
        }
        catch (err) {
            console.log('uh oh');
            res.send(`don't do whatever bad thing you did again`);
        }
    }
});
app.get('/Presentation.html', (req,res) => {
    var index = hw5Directory + 'Presentation.html';
    res.send(index)
});
app.get('/Teams.html', (req,res) => {
    var index = hw5Directory + 'Teams.html';
    res.send(index)
});
app.post('/teams', (req,res) => {
    if(req.body.morp == 0) {
        //Mongo configs, I ripped the below lines from the first
        const { MongoClient } = require('mongodb');
        const uri = "mongodb://127.0.0.1/lsgordon";
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        async function queryMongo(){
            try {
                await client.connect();
                //querying mongo
                let substr = '^' + req.body.name + '.*'
                const x1 = await client.db().collection('Race_record_final').find({ 'team.team_name': { $regex: substr, $options: 'i' } }).toArray();
                //console.log(x1);
                let outArr = [];
                let state = req.body.state;
                for(let i = 0; i<x1.length;i++) {
                    if(x1[i].team.state == state) {
                        outArr.push(x1[i].team.team_name);
                    }
                }
                //make them unique
                outArr = new Set(outArr);
                outArr = Array.from(outArr);
                //console.log(outArr);
                res.send(outArr);
            }
            catch(e) {
                console.error(e);
            }
            finally {
                await client.close;
            }
        }
        queryMongo()
    }
    else { //now we do postgres
        //pg configs
        const { Client } = require('pg');
        const client = new Client({
            user: 'lsgordon_123',
            password: '12345678',
            port: '5432',
            host: 'localhost',
            database: 'lsgordon'
        });
        let qstr = `
        SELECT team_name 
        FROM teams 
        WHERE team_name like '` + req.body.name + `%'
        AND state = '` + req.body.state + `'`
        client.connect().then(() => {
            client.query(qstr, (err,res1) => {
                if (err) {
                    console.error('ruh roh' + '\n' + err);
                }
                else {
                    x1 = res1.rows;
                    outArr = []
                    for(let i = 0; i<x1.length;i++) {
                        outArr.push(x1[i].team_name);
                    }
                    //console.log(outArr);
                    res.send(outArr);
                }
            })
        })
    }
});
//these are used later
let pattern = /(?=(.*:))(\d:\d{2}\.\d{2})|(\d*.\d{2})/;
app.post('/times', (req,res) => {
    //goal is to first process queries, and then clean the result
    if(req.body.morp==0) {
        //monfigs
        const { MongoClient } = require('mongodb');
        const uri = "mongodb://127.0.0.1/lsgordon";
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        async function queryMongo() {
            try {
                await client.connect();
                const substr1 = req.body.event;
                const substr2 = req.body.sex;
                const x1 = await client.db().collection('Race_record_final').find({ $and:[{ 'event': { $regex: substr1, $options: 'i' } },{ 'event': { $regex: substr2, $options: 'i' } },{'team.city':{$ne:""}}]}).toArray();
                midArr = [];
                //console.log(x1.length);
                for(let i = 0;i<x1.length;i++){
                    let x2 = x1[i].result;
                    //console.log(x2);
                    midArr.push(x2.match(pattern));
                }
                //console.log(midArr);
                midArr2 = [];
                for(let i = 0; i< midArr.length;i++) {
                    if (midArr[i] != null) {
                        midArr2.push(midArr[i][0]);
                    }
                }
                //call the final function
                x4 = (1-lastOne(midArr2,req.body.time))
                res.send({response: x4});
            }
            catch (err) {
                console.log('ruh roh, an error', err)
            }
        }
        queryMongo()
    }
    else {
    //and now for postgres
    const { Client } = require('pg');
        const client = new Client({
            user: 'lsgordon_123',
            password: '12345678',
            port: '5432',
            host: 'localhost',
            database: 'lsgordon'
        })    
    
    const substr1 = req.body.event;
    const substr2 = req.body.sex;
    let qstr = 
    `SELECT result 
    FROM race_record
    INNER JOIN teams on teams.team_id = race_record.team_id
    WHERE event LIKE '%` + req.body.event +
    `%' AND event LIKE '%` + req.body.sex + `%'`
    + `AND teams.city != ''`;
    client.connect().then(() => {
        client.query(qstr, (err,res1) => {
            if(err) {
                console.error('ruh roh' + '\n' + err);
            }
            else {
                x1 = res1.rows;
                //console.log(x1.length);
                for(let i = 0; i<x1.length;i++) {
                    x1[i] = x1[i].result;
                }
                outArr = [];
                for(let i = 0; i<x1.length;i++) {
                    //voodoo below
                    let x2 = x1[i].match(pattern);
                    if(x2 != null) {
                        outArr.push(x2[0]);
                    }
                }
                //call the final function, it's weird but I don't have to copy code
                x1 = (1-lastOne(outArr,req.body.time));
                //console.log(x1);
                res.send({response: x1});

            }
        })
    })
}
})

app.post('/team_name', (req,res) => {
    //We want to return roster, roster_size, and team state
    
    if(req.body.morp == 0) {
        const { MongoClient } = require('mongodb');
        const uri = "mongodb://127.0.0.1/lsgordon";
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        async function queryMongo() {
            await client.connect();
            const substr = 'name:'+req.body.name;
            //console.log(substr);
            const x1 = await client.db().collection('Race_record_final').find({"team.team_name":req.body.name}).toArray();
            //console.log(x1)
            outArr=[];
            for(let i = 0; i < x1.length; i++) {
                if(x1[i].athlete.name in outArr) {
                    //I could not the entire condition, but I did this and it is cool
                    () => {};
                }
                else {
                    outArr.push(x1[i].athlete.name);
                }
            }
            res.send(outArr);
        }
        queryMongo();
    }
    else {
        const { Client } = require('pg');
        const client = new Client({
            user: 'lsgordon_123',
            password: '12345678',
            port: '5432',
            host: 'localhost',
            database: 'lsgordon'
        })
        const substr1 = req.body.name;    
        console.log(substr1);
        const qstr = `
        SELECT *
        FROM athletes
        INNER JOIN teams on teams.team_id = athletes.team_id
        WHERE teams.team_name = '` + substr1 + `'`;
        client.connect().then(() => {
            client.query(qstr, (err,res1) => {
                if(err) {
                    console.error('ruh roh' + '\n' + err);
                }
                else {
                    x1 = res1.rows;
                    console.log(x1);
                    outArr= [];
                    for(let i = 0; i<x1.length;i++) {
                        outArr.push(x1[i].name);
                    }
                    outArr.sort()
                    res.send(outArr)
                }
            })
        })
    }
});