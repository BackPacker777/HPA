/**
 *   @author Bates, Howard [ hbates@northmen.org ]
 *   @version 0.0.1
 *   @summary http server: HPA Forms || Created: 05.25.2016
 *   @todo zip code DB; save as PDF; save as CSV
 */

"use strict";

const FADE = require('./FadeStuff');
const DATA_HANDLER = require('./DataHandler');

class main {
     constructor() {
          this.zipCodes = this.loadZipCodes();
          main.handleAllergies();
          main.setDate();
     }

     loadZipCodes() {
          return new DATA_HANDLER();
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

     static setDate() {
          let date = new Date();
          document.getElementById('date').value = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`;
     }
	 
	 static fade(direction, fadeWhat) {
          new FADE(direction, fadeWhat).doFade();
     }
}

new main();