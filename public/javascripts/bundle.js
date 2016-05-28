/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 *   @author Bates, Howard [ hbates@northmen.org ]
	 *   @version 0.0.1
	 *   @summary http server: HPA Forms || Created: 05.25.2016
	 *   @todo save as PDF; save as CSV
	 */

	"use strict";

	const FADE = __webpack_require__(1);

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

/***/ },
/* 1 */
/***/ function(module, exports) {

	/*  AUTHOR: hbates@northmen.org
	 *  VERSION: 1.0
	 *  CREATED: 12.01.2015
	 */

	"use strict";

	class FadeStuff {
	    constructor(direction, fadeWhat) {
	        this.direction = direction;
	        this.fadeWhat = fadeWhat;
	    }

	    doFade() {
	        //http://www.chrisbuttery.com/articles/fade-in-fade-out-with-javascript/
	        let div = document.getElementById(this.fadeWhat);
	        if (this.direction == "in") {
	            div.style.opacity = 0;
	            div.style.visibility = 'visible';
	            (function fade() {
	                let val = parseFloat(div.style.opacity);
	                if (!((val += .01) >= 1)) {
	                    div.style.opacity = val;
	                    requestAnimationFrame(fade);
	                }
	            })();
	        } else if (this.direction == "out") {
	            div.style.opacity = 1;
	            (function fade() {
	                if ((div.style.opacity -= .01) <= 0) {
	                    div.style.visibility = 'hidden';
	                } else {
	                    requestAnimationFrame(fade);
	                }
	            })();
	        }
	    }
	}

	module.exports = FadeStuff;

/***/ }
/******/ ]);