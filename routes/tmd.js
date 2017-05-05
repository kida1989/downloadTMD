var express = require('express');
var mongoose = require('mongoose');
var sql = require ('mssql');
var router = express.Router();
var Radar = require('../model/radarmeasurement.js')


//Connection String
const config = {
  user: 'tmadmin',
  password: 'TrackMan123',
  server: 'kmqed1sonq.database.windows.net',
  database: 'TrackMan.Baseball',
  options: {
    encrypt: true // Use this if you're on Windows Azure
    }
  };


/* GET users listing. */
router.get('/getTMD', function(req, res, next) {
  var PitchUID = req.query.pitchuid;

  var getMeasurementId = (pitchuid)=>{
    return new Promise((resolve,reject)=>{
      var data =[];
      var querystring = `SELECT MeasurementId FROM dbo.Tag
                          WHERE TagId = '`+PitchUID+`'`

      sql.connect(config,err => {
        const request = new sql.Request();

        request.stream =true;
        request.query(querystring);

        request.on('recordset',columns => {

        });

        request.on('row', row =>{
          data.push(row)
        });

        request.on('done', result =>{

          resolve(data[0].MeasurementId);

          sql.close();

        })

        request.on('error',err=>{

        });


      })


    })
  }

  var getURL = (MeasurementId)=>{
    var mId = MeasurementId.toLowerCase();
    console.log(mId)
    var db = 'mongodb://mdb0.trackmanbaseball.com:27000/TMBBPro';
    mongoose.connect(db, function(err){
      if (err) throw err;
      console.log("Connection" + " to "+ db + " Sucessful!")
    });
    return new Promise((resolve,reject)=>{



      Radar.aggregate(

      	// Pipeline
      	[
      		// Stage 1
      		{
      			$match: {
      				_id:mId
      			}
      		},

      		// Stage 2
      		{
      			$project: {
      			    "URL":'$TmdFile.FileUrl'
      			}
      		},

      	],function(err,doc){
              if(err) {throw err}

              else{
                resolve(doc)
                mongoose.connection.close();
              }
            })



    })
  }



  getMeasurementId(PitchUID)
    .then((resolve)=>{
      getURL(resolve)
      .then((resolve)=>{
        console.log(resolve)
        res.render('tmd',resolve)
      })
    })





});

module.exports = router;
