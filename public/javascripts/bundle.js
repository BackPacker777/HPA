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
	 *   @todo 
	 */

	"use strict";

	const FADE = __webpack_require__(1);

	class main {
	     constructor() {
	          document.getElementById('theForm').onsubmit = () => {
	               return false;
	          };
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
	          document.getElementById('date').value = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
	     }

	     static setAge() {
	          document.getElementById('dob').addEventListener('blur', () => {
	               let dob = document.getElementById('dob').value.split('-');
	               document.getElementById('age').value = new Date().getFullYear() - dob[0];
	          });
	     }

	     handleSubmit() {
	          document.getElementById('submit').addEventListener('click', () => {
	               if (document.getElementById('lastName').value != '' && document.getElementById('firstName').value != '' &&
	                    document.getElementById('age').value != '' && document.getElementById('goodHealth').checked) {
	                    if (document.getElementById('localPhone').value == '' || /\d{3}-\d{3}-\d{4}/.test(document.getElementById('localPhone').value)
	                         && document.getElementById('cellPhone1').value == '' || /\d{3}-\d{3}-\d{4}/.test(document.getElementById('cellPhone1').value)
	                         && document.getElementById('cellPhone2').value == '' || /\d{3}-\d{3}-\d{4}/.test(document.getElementById('cellPhone2').value)
	                         && document.getElementById('sponsorPhone').value == '' || /\d{3}-\d{3}-\d{4}/.test(document.getElementById('sponsorPhone').value)
	                         && document.getElementById('emergPhone').value == '' || /\d{3}-\d{3}-\d{4}/.test(document.getElementById('emergPhone').value))
	                    {
	                         this.processForm();
	                    } else {
	                         alert(`Please correct telephone number(s)`);
	                    }
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