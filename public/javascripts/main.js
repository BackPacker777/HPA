/**
 *   @author Bates, Howard [ hbates@northmen.org ]
 *   @version 0.0.1
 *   @summary http server: HPA Forms || Created: 05.25.2016
 *   @todo save as PDF; save as CSV
 */

"use strict";

const FADE = require('./FadeStuff');

class main {
     constructor() {
          this.zipCodes = null;
          this.loadZipCodes();
          main.handleAllergies();
          main.setDate();
          this.handleZipEntry();
     }

     loadZipCodes() {
          let bustCache = '?' + new Date().getTime();
          const XHR = new XMLHttpRequest();
          XHR.open('POST', document.url  + bustCache, true);
          XHR.setRequestHeader('X-Requested-load', 'XMLHttpRequest2');
          XHR.send();
          XHR.onload = () => {
               if (XHR.readyState == 4 && XHR.status == 200) {
                    let zipData = XHR.responseText;
                    const COLUMNS = 3;
                    let tempArray, finalData = [];
                    tempArray = zipData.split(/\r?\n/); //remove newlines
                    for (let i = 0; i < tempArray.length; i++) {
                         finalData[i] = tempArray[i].split(/,/).slice(0, COLUMNS);
                    }
                    this.zipCodes = finalData;
               }
          };
     }

     static handleAllergies() {
          document.getElementById('allergiesDiv').style.visibility = 'hidden';
          document.getElementById('yesAllergy').addEventListener('click', () => {
               main.fade('in', 'allergiesDiv');
          });
          document.getElementById('noAllergy').addEventListener('click', () => {
               main.fade('out', 'allergiesDiv');
               document.getElementById('allergies').value = '';
          });
     }

     handleZipEntry() {
          document.getElementById('zip').addEventListener('change', () => {
               for (let i = 0; i < this.zipCodes.length; i++) {
                    if (document.getElementById('zip').value == this.zipCodes[i][0]) {
                         document.getElementById('city').value = this.zipCodes[i][1];
                         document.getElementById('state').value = this.zipCodes[i][2];
                         console.log(`City: ${this.zipCodes[i][1]}  State: ${this.zipCodes[i][2]}`);
                         break;
                    }
               }
          });
     }

     static setDate() {
          let date = new Date();
          document.getElementById('date').value = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`;
     }
	 
	 static fade(direction, fadeWhat) {
          new FADE(direction, fadeWhat).doFade();
     }
}

window.addEventListener('load', () => {
     new main();
});