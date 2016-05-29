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
          main.setAge();
          this.handleSubmit();
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
                         break;
                    }
               }
          });
     }

     static setDate() {
          let date = new Date();
          document.getElementById('date').value = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`;
     }

     static setAge() {
          document.getElementById('dob').addEventListener('blur', () => {
               let dob = document.getElementById('dob').value.split('-');
               document.getElementById('age').value = new Date().getFullYear() - dob[0];
          });
     }

     handleSubmit() {
          document.getElementById('submit').addEventListener('click', () => {
               if (document.getElementById('lastName').value != '' || document.getElementById('firstName').value != '' ||
                    document.getElementById('age').value != '' || document.getElementById('goodHealth').checked) {
                    this.processForm();
               } else {
                    alert('Please fill in all required fields');
               }
          });
     }

     processForm() {
          let bustCache = '?' + new Date().getTime();
          const XHR = new XMLHttpRequest();
          XHR.open('POST', document.url  + bustCache, true);
          XHR.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
          let data = new FormData(document.querySelector('form')); // https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects
          XHR.send(data);
          XHR.onload = () => {
               if (XHR.readyState == 4 && XHR.status == 200) {
                    document.getElementById('result').innerHTML = XHR.responseText;
                    main.fade('in', 'result');
                    main.fade('out', 'result');
               }
          };
     }
	 
	 static fade(direction, fadeWhat) {
          new FADE(direction, fadeWhat).doFade();
     }
}

window.addEventListener('load', () => {
     new main();
});