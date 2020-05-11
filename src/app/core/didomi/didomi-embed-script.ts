import { environment } from '../../../environments/environment';

export const DIDOMI_EMBED = `
  window.gdprAppliesGlobally=true;
  (function(){function n(){if(!window.frames.__cmpLocator){if(document.body&&document.body.firstChild){var e=document.body;var t=document.createElement("iframe");t.style.display="none";t.name="__cmpLocator";t.title="cmpLocator";e.insertBefore(t,e.firstChild)}else{setTimeout(n,5)}}}function e(e,t,n){if(typeof n!=="function"){return}
  if(!window.__cmpBuffer){window.__cmpBuffer=[]}if(e==="ping"){n({gdprAppliesGlobally:window.gdprAppliesGlobally,cmpLoaded:false},true)}else{window.__cmpBuffer.push({command:e,parameter:t,callback:n})}}e.stub=true;function t(r){if(!window.__cmp||window.__cmp.stub!==true){return}if(!r.data){return}var a=typeof r.data==="string";var e;try{e=a?JSON.parse(r.data):r.data}catch(t){return}if(e.__cmpCall){var o=e.__cmpCall;window.__cmp(o.command,o.parameter,function(e,t){var n={__cmpReturn:{returnValue:e,success:t,callId:o.callId}};r.source.postMessage(a?JSON.stringify(n):n,"*")})}}if(typeof window.__cmp!=="function"){window.__cmp=e;if(window.addEventListener){window.addEventListener("message",t,false)}else{window.attachEvent("onmessage",t)}}n()})();(function(e){var t=document.createElement("script");t.id="spcloader";t.type="text/javascript";t.async=true;t.src="https://sdk.privacy-center.org/"+e+"/loader.js?target="+document.location.hostname;t.charset="utf-8";var n=document.getElementsByTagName("script")[0];
  n.parentNode.insertBefore(t,n)})("${environment.didomiKey}");
`;
