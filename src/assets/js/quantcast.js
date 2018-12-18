var elem = document.createElement('script');
elem.src = 'https://quantcast.mgr.consensu.org/cmp.js';
elem.async = true;
elem.type = "text/javascript";
var scpt = document.getElementsByTagName('script')[0];
scpt.parentNode.insertBefore(elem, scpt);
(function() {
  var gdprAppliesGlobally = false;
  function addFrame() {
    if (!window.frames['__cmpLocator']) {
      if (document.body) {
        var body = document.body,
          iframe = document.createElement('iframe');
        iframe.style = 'display:none';
        iframe.name = '__cmpLocator';
        body.appendChild(iframe);
      } else {
        setTimeout(addFrame, 5);
      }
    }
  }
  addFrame();
  function cmpMsgHandler(event) {
    var msgIsString = typeof event.data === "string";
    var json;
    if(msgIsString) {
      json = event.data.indexOf("__cmpCall") != -1 ? JSON.parse(event.data) : {};
    } else {
      json = event.data;
    }
    if (json.__cmpCall) {
      var i = json.__cmpCall;
      window.__cmp(i.command, i.parameter, function(retValue, success) {
        var returnMsg = {"__cmpReturn": {
          "returnValue": retValue,
          "success": success,
          "callId": i.callId
        }};
        event.source.postMessage(msgIsString ?
          JSON.stringify(returnMsg) : returnMsg, '*');
      });
    }
  }
  window.__cmp = function (c) {
    var b = arguments;
    if (!b.length) {
      return __cmp.a;
    }
    else if (b[0] === 'ping') {
      b[2]({"gdprAppliesGlobally": gdprAppliesGlobally,
        "cmpLoaded": false}, true);
    } else if (c == '__cmp')
      return false;
    else {
      if (typeof __cmp.a === 'undefined') {
        __cmp.a = [];
      }
      __cmp.a.push([].slice.apply(b));
    }
  };
  window.__cmp.gdprAppliesGlobally = gdprAppliesGlobally;
  window.__cmp.msgHandler = cmpMsgHandler;
  if (window.addEventListener) {
    window.addEventListener('message', cmpMsgHandler, false);
  }
  else {
    window.attachEvent('onmessage', cmpMsgHandler);
  }
})();

var lang = document.documentElement.lang;
var quancastOptions = {
  es: {
    'Language': 'es',
    'Initial Screen Title Text': 'Tu privacidad es importante para nosotros',
    'Initial Screen Reject Button Text': 'No acepto',
    'Initial Screen Accept Button Text': 'Acepto',
    'Initial Screen Purpose Link Text': 'Más información',
    'Purpose Screen Title Text': 'Tu privacidad es importante para nosotros',
    'Purpose Screen Body Text': 'Puedes configurar tus preferencias y elegir como quieres que tus datos sean utilizados para los siguientes propósitos. Puedes elegir configurar tus preferencias solo con nosotros independientemente del resto de nuestros partners. Cada propósito tiene una descripción para que puedas saber como nosotros y nuestros partners utilizamos tus datos',
    'Purpose Screen Enable All Button Text': 'Habilitar todo',
    'Purpose Screen Vendor Link Text': 'Ver lista completa de partners',
    'Purpose Screen Cancel Button Text': 'Cancelar',
    'Purpose Screen Save and Exit Button Text': 'Guardar y salir',
    'Vendor Screen Title Text': 'Tu privacidad es importante para nosotros',
    'Vendor Screen Body Text': 'Puedes dar tu consentimiento de manera individual a cada partner. Ver la lista de todos los propósitos para los cuales utilizan tus datos para tener más información. En algunos casos, las empresas pueden revelar que usan tus datos sin pedir tu consentimiento, en función de intereses legítimos. Puedes hacer click en su política de privacidad para obtener más información al respecto o para rechazarlo.',
    'Vendor Screen Accept All Button Text': 'Aceptar todo',
    'Vendor Screen Reject All Button Text': 'Rechazar todo',
    'Vendor Screen Purposes Link Text': 'Ver porpósitos',
    'Vendor Screen Cancel Button Text': 'Cancelar',
    'Vendor Screen Save and Exit Button Text': 'Guardar y salir',
    'Initial Screen Body Text': 'Tanto nuestros partners como nosotros utilizamos cookies en nuestro sitio web para personalizar contenido y publicidad, proporcionar funcionalidades a las redes sociales, o analizar nuestro tráfico. Haciendo click consientes el uso de esta tecnologia en nuestra web. Puedes cambiar de opinion y personalizar tu consentimiento siempre que quieras volviendo a esta web',
    'Initial Screen Body Text Option': 1,
    'Min Days Between UI Displays': 10,
    'Publisher Name': 'Wallapop',
    'Publisher Purpose IDs': [1, 2, 3, 4, 5],
    'Publisher Logo': '/images/logos/quantcast-logo.png',
    'No Option': false,
    'UI Layout': 'banner',
    'Display Persistent Consent Link': false,
    'Default Value for Toggles': 'on',
    'Publisher Purpose Legitimate Interest IDs': [1,2,3,4,5],
    'Custom Links Displayed on Initial Screen': [
      "[Cookies policy](http://es.wallapop.com/cookies)",
    ],
    "Cookie Domain": "wallapop.com"
  },
  en: {
    'Language': 'en',
    'Initial Screen Reject Button Text': 'I do not accept',
    'Initial Screen Accept Button Text': 'I accept',
    'Purpose Screen Body Text': 'You can set your consent preferences and determine how you want your data to be used based on the purposes below. You may set your preferences for us independently from those of third-party partners. Each purpose has a description so that you know how we and partners use your data.',
    'Vendor Screen Body Text': 'You can set consent preferences for each individual third-party company below. Expand each company list item to see what purposes they use data for to help make your choices. In some cases, companies may disclose that they use your data without asking for your consent, based on their legitimate interests. You can click on their privacy policies for more information and to opt out.',
    'Vendor Screen Accept All Button Text': 'Accept all',
    'Vendor Screen Reject All Button Text': 'Reject all',
    'Initial Screen Body Text': 'We and our partners use technology such as cookies on our site to personalise content and ads, provide social media features, and analyse our traffic. Click below to consent to the use of this technology across the web. You can change your mind and change your consent choices at anytime by returning to this site.',
    'Initial Screen Body Text Option': 1,
    'Min Days Between UI Displays': 10,
    'Publisher Name': 'Wallapop',
    'Publisher Purpose IDs': [1,2,3,4,5],
    'Publisher Logo': '/images/logos/quantcast-logo.png',
    'No Option': false,
    'Display Persistent Consent Link': false,
    'Default Value for Toggles': 'on',
    'Publisher Purpose Legitimate Interest IDs': [1,2,3,4,5],
    'Custom Links Displayed on Initial Screen': [
      "[Cookies policy](http://uk.wallapop.com/cookies)",
    ],
    "Cookie Domain": "wallapop.com"
  }
};
