var starcounterDebugAid=function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={i:d,l:!1,exports:{}};return a[d].call(e.exports,e,e.exports,b),e.l=!0,e.exports}var c={};return b.m=a,b.c=c,b.d=function(a,c,d){b.o(a,c)||Object.defineProperty(a,c,{configurable:!1,enumerable:!0,get:d})},b.n=function(a){var c=a&&a.__esModule?function(){return a['default']}:function(){return a};return b.d(c,'a',c),c},b.o=function(a,b){return Object.prototype.hasOwnProperty.call(a,b)},b.p='/sys/jsoneditor/dist/img/',b(b.s=0)}([function(){if('undefined'!=typeof chrome&&'undefined'==typeof a)var a=chrome;if('undefined'!=typeof a&&a.runtime&&a.runtime.onMessage){a.runtime.onMessage.addListener((a,b,c)=>{if(a&&a.content)switch(a.content){case'Hey! Are you a Starcounter app?':c(document.querySelector('puppet-client, palindrom-client')?'Yup!':'Nope!');break;case'showDebugAid':window.dispatchEvent(new CustomEvent('sc-debug-show-'+a.type));}});const b=a.extension.getURL('ui-popup-build.js');localStorage.setItem('scDebugPopupIndexScriptUrl',b);const c=a.extension.getURL('injected_script.js'),d=document.createElement('SCRIPT');d.src=c,d.onload=function(){window.localStorage.getItem('starcounterDebug-popup-open')&&'false'!==window.localStorage.getItem('starcounterDebug-popup-open')&&window.dispatchEvent(new CustomEvent('sc-debug-show-popup'))},document.body.appendChild(d),document.body.appendChild(document.createElement('just-an-arbitrary-element-to-tell-sc-debug-aid-extension-was-installed'))}}]);