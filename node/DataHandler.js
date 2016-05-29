/**
 *   @author Bates, Howard [ hbates@northmen.org ]
 *   @version 0.0.1
 *   @summary http server: HPA Forms || Created: 05.25.2016
 *   @todo save as PDF;
 */

"use strict";

const FS = require ('fs'),
     DATASTORE = require('nedb'),
     JSON2CSV = require('json2csv'),
     MAILER = require('nodemailer'),
     YA_CSV = require('ya-csv');

let DB = new DATASTORE({ filename: './data/forms_db.json', autoload: true });

class DataHandler {
	constructor(whichAjax, data) {
          if (whichAjax == 0 || whichAjax == 1) {
               this.sendEmail(data);
               this.saveCSV(data);
          }
	}

     loadCSVData(filePath, callback) {
          let fileHandle = FS.readFileSync(filePath, 'utf8');
          callback(fileHandle.toString());
     }

     sendEmail(data) {
          let smtpTrans = MAILER.createTransport('smtp://cc166f8c21481f328aab3eec3e563a06%40in-v3.mailjet.com:84c0c029e844d5ed04409a166b16ed33');

          let mailOptions = {
               from: 'HB <coder@codeelegant.com>',
               to: 'arct.farion@gmail.com',
               subject: 'New Camper Registration',
               html: `<h1>${data.lastName}</h1>`,
               attachments: [{
                    fileName: 'forms_db.csv',
                    path: './data/forms_db.csv'
               }]
          };

          smtpTrans.sendMail(mailOptions, (err) => {
               if(err){
                    console.log(err);
               } else {
                    console.log('Message sent!');
               }
          });
     }

     saveCSV(data) {
          let csvData = ['lastName', 'firstName', 'dob', 'age', 'parents', 'summerAddr', 'email', 'street', 'zip', 'city', 'state',
               'localPhone', 'cellPhone1', 'cellPhone2', 'sponsorLastName', 'sponsorFirstName', 'sponsorPhone', 'allergies',
               'allergiesList', 'medicalProbs', 'emergLastName', 'emergLastNam', 'emergPhone', 'adults', 'billingName',
               'cottageNum', 'childName', 'aidPermission', 'goodHealth', 'adhere', 'childArrange', 'parentSign', 'parentPrint',
               'date'];
          JSON2CSV({ data: data, fields: csvData , hasCSVColumnTitle: false}, (err, csv) => {
               let csvData = csv.replace(/['"]+/g, '').split(',');
               let write = YA_CSV.createCsvFileWriter('./data/forms_db.csv', {'flags': 'a'});
               write.writeRecord(csvData);
          });
     }

     loadData(callback) {
          DB.find({}, (err, docs) => {
               if (docs.length != null) {
                    callback(docs);
               }
          });
     }

     queryData(data) {
          DB.findOne({ _id: data.id }, (err, docs) => {
               if (docs == null) {
                    this.addData(data);
               } else {
                    this.updateData(data);
               }
          });
     }

     updateData(data) {
          DB.update({ _id: data.id }, { building: data.building
               , roomNumber: data.roomNumber
               , submitter: data.submitter
               , problemDesc: data.problemDesc
               , assigned: data.assigned
               , completed: data.completed
               , status: data.status
               , date: data.date
          }, { upsert: true });
     }

     addData(data) {
          delete data.id;  // remove id field out of JSON parameter
          DB.insert(data);
      }

     /*queryData(data) { // keep as a reference for method above
          const THAT = this; //change to arrow function later
          // console.log(`DataHandler output: ${data.id}`);
          DB.findOne({ _id: data.id }, function(err, docs) {
               if (docs == null) {
                    THAT.addData(data);
               } else {
                    THAT.updateData(data);
               }
          });
     }*/
}

module.exports = DataHandler;