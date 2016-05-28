
/*  AUTHOR: hbates@northmen.org
 *  VERSION: 1.0.0
 *  CREATED: 11.25.2015
 */

"use strict";

class LoadDataClass {
     constructor(filePath, callback) {
          let request = new XMLHttpRequest();
          request.open("GET", filePath, true);
          request.send();
          request.onload = () => {
               const COLUMNS = 4;
               let data, middleData, finalData = [];
               if (request.readyState === 4 && request.status === 200) {
                    data = request.responseText.split(/\n/);
               }
               for (let i = 0; i < data.length; i++) {
                    middleData = data[i].split(/,/);
                    finalData[i] = []; //makes it an MD array
                    for (let j = 0; j < COLUMNS; j++) {
                         finalData[i][j] = middleData[j];
                    }
               }
               callback(finalData);
          };
     }
 }

module.exports = DataHandler;