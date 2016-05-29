/**
 *   @author Bates, Howard [ hbates@northmen.org ]
 *   @version 0.0.1
 *   @summary http server: HPA Forms || Created: 05.25.2016
 *   @todo save as PDF; save as CSV
 */

"use strict";

const FS = require ('fs'),
     DATASTORE = require('nedb'),
     PDF = require('html5-to-pdf'),
     JSREPORT = require('jsreport');

let DB = new DATASTORE({ filename: './data/forms_db.json', autoload: true });
     this.data = [];

class DataHandler {
	constructor(whichAjax, data, req) {
          if (whichAjax == 0 || whichAjax == 1) {
               this.savePDF(data);
          }
	}

     loadCSVData(filePath, callback) {
          let fileHandle = FS.readFileSync(filePath, 'utf8');
          callback(fileHandle.toString());
     }

     savePDF(data) {
          /*for (let key in Object.keys(data)) {
               console.log(data.key);
          }*/
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
          }, { upsert: true,
               returnUpdatedDocs: true });
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