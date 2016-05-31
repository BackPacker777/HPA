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
     PDF = require('html-pdf'),
     EJS = require('ejs'),
     YA_CSV = require('ya-csv');

let DB = new DATASTORE({ filename: './data/forms_db.json', autoload: true });

class DataHandler {
	constructor(whichAjax, data, req, res) {
          this.file = null;
          if (whichAjax == 0) {
               // this.saveHTML(data);
               this.savePDF(data);
               this.saveCSV(data);
               this.sendEmail();
          }
	}

     loadCSVData(filePath, callback) {
          let fileHandle = FS.readFileSync(filePath, 'utf8');
          callback(fileHandle.toString());
     }

     saveHTML(data) {
          FS.writeFile('./public/views/result.json', JSON.stringify(data));
     }

     savePDF(data) {
          let html = null;
          EJS.renderFile('./public/views/results.ejs', {lastName: data.lastName, firstName: data.firstName, dob: data.dob,
               age: data.age, parents: data.parents, summerAddr: data.summerAddr, email: data.email, street: data.street,
               city: data.city, state: data.state, zip: data.zip, localPhone: data.localPhone, cellPhone1: data.cellPhone1,
               cellPhone2: data.cellPhone2, sponsorLastName: data.sponsorLastName, sponsorFirstName: data.sponsorFirstName,
               sponsorPhone: data.sponsorPhone, allergies: data.allergies, allergiesList: data.allergiesList, medicalProbs: data.medicalProbs,
               emergLastName: data.emergLastName, emergFirstName: data.emergFirstName, emergPhone: data.emergPhone, adults: data.adults,
               billingName: data.billingName, cottageNum: data.cottageNum, childName: data.childName, aidPermission: data.aidPermission,
               goodHealth: data.goodHealth, adhere: data.adhere, childArrange: data.childArrange, parentSign: data.parentSign,
               parentPrint: data.parentPrint, date: data.date
          }, (err, str) => {
               if (err) {
                    console.log(`ERROR: ${err}`);
               } else if (str) {
                    html = str;
               } else {
                    console.log(`EJS no workie!`);
               }
          });

          PDF.create(html).toStream((err, stream) => {
               stream.pipe(FS.createWriteStream('./data/registrations/camper.pdf'));
          });
     }

     getResultsJSON() {
          return FS.readFileSync('./public/views/result.json', 'utf8');
     }

     sendEmail() {
          let api_key = 'key-72dc0e81b6f63109e2131712aa5fe3e6';
          let domain = 'sandbox20abcc20bfc3457ba733493c74f521f8.mailgun.org';
          let mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
          let email = {
               from: 'Registering Camper <coder@codeelegant.com>',
               to: 'bates4e@gmail.com',
               subject: 'Hello',
               text: 'Registration attached',
               attachment: './data/registrations/camper.pdf'
          };

          mailgun.messages().send(email, (err, body) => {
               console.log(body);
          });
     }

     saveCSV(data) {
          let csvData = ['lastName', 'firstName', 'dob', 'age', 'parents', 'summerAddr', 'email', 'street', 'zip', 'city', 'state',
               'localPhone', 'cellPhone1', 'cellPhone2', 'sponsorLastName', 'sponsorFirstName', 'sponsorPhone', 'allergies',
               'allergiesList', 'medicalProbs', 'emergLastName', 'emergFirstName', 'emergPhone', 'adults', 'billingName',
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