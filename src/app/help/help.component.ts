import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'tsl-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {

  public features = [{
    title: 'Planificacion de Destacados',
    desc: 'Cómo funciona la planificación',
    link: 'Perfil-6'
  }, {
    title: 'Suscripción de visibilidad',
    desc: 'Todas las opciónes de visibilidad a tu medida',
    link: 'Perfil-5'
  }, {
    title: 'Destacados extras',
    desc: 'Cúando, como y porque usar extras',
    link: 'Perfil-4'
  }, ];

  public faqs = {
    es: [{
      category: 'Perfil',
      questions: [{
        title: '¿Qué información puedo encontrar en mi perfil?',
        text: 'En el perfil, en la parte superior,  localizarás tres secciones donde encontrarás Perfil (información relativa a tu cuenta), datos de facturación y planes de suscripción'
      }, {
        title: '¿Qué puedo modificar de mi cuenta?',
        text: 'Desde la sección de perfil puedes subir una foto de perfil. Recuerda que sólo aceptamos formatos .jpg. También podrás cerrar sesión, modificar todos los campos que te aparecen incluyendo la ubicación y tu contraseña.'
      }, {
        title: '¿Para qué sirve la información de facturación?',
        text: 'Esta información nos permite darte la facilidad de comprar extras mediante el pago con tarjeta de crédito, así como la emisión una factura. Todos los campos son obligatorios para que la factura sea completa.'
      }, {
        title: 'Tu Plan de coches',
        text: 'El plan actual te índica con que plan de coches estás suscrito a wallapop. Por ejemplo, si estás suscrito al "Plan 50", significa que puedes tener 50 hasta coches activos al mismo tiempo.'
      }, {
        title: 'Tu Plan de visibilidad',
        text: 'La suscripción a planes de visibilidad ofrece dos packs para destacar en tu ciudad y destacar a nivel nacional. Tienes la posibilidad de comprar 25, 90 o 300 destacados de 24 horas para cada uno de los destacados. Cuánto más alto sea el pack mayor es tu porcentaje de ahorro. Puedes darte de alta a cualquier plan o cambiar el plan al que estás suscrito llamando al 674 726 372 o enviando un correo a ventas.motor@wallapop.com'
      }, {
        title: '¿Para qué me sirve destacar un coche?',
        text: 'Los destacados permiten que tu coche tenga más visibilidad y que aparezca en las primeras posiciones tanto de la web como de la app. Además la ficha de tu coche tendrá una visualización diferente y estará en la zona de destacados de la app.'
      }]
    }, {
      category: 'Catálogo',
      questions: [{
        title: 'Tu Catálogo',
        text: 'En el catálogo tienes toda la información de los coches que tienes. Verás que hay varias sub-secciones donde te enseñamos los coches que tienes activos en ese momento, los inactivos, los que tienes destacados en ese día y los que ya has vendido. Además en la parte superior tienes un resumen del plan de coches al que estás suscrito y la cantidad de coches que tienes disponibles aún para subir dependiendo de tu plan y la cantidad de coches inactivos que tienes. Además puedes ver un resumen de los planes de visibilidad, el saldo de destacados que tienes disponibles y los que estás utilizando en este momento y el número que tienes planificados. Recuerda que cada destacado dura 24 horas, así que si tienes un coche destacado por tres días, te cuenta como 3 destacados planificados.'
      }, {
        title: '¿Que acciones puedo hacer para cada coche?',
        text: 'Podrás editar, reservar o marcar como vendido un coche de manera individual y podrás destacar tus coches, o bien desactivarlos y borrarlos de manera individual o con una acción múltiple si seleccionas más de un coche.'
      }, {
        title: '¿Puedo ordenar mi catálogo de coches?',
        text: 'Tenemos tres tipos de ordenación para que elijas la que más te convenga; por fecha de creación, por más reciente o por precio, del más alto al más bajo o al revés.'
      }, {
        title: '¿Puedo buscar dentro de mis productos?',
        text: 'Puedes hacer clic en el icono de la lupa y buscar por nombre tus productos dentro de todo tu catálogo.'
      }, {
        title: '¿Puedo subir un coche de forma manual desde mi catálogo?',
        text: 'Tienes varios botones de acción para que puedas subir un coche a tu perfil de wallapop. Encontrarás en la barra superior de la navegación un botón que pone "Subir coche" y el mismo botón lo tendrás en tu catálogo. Elije el que más te convenga y sube manualmente tus coches.'
      }, {
        title: '¿Qué información veo en la ficha de mi coche?',
        text: 'En la ficha de tu coche verás la foto, el precio y el nombre del coche. Tienes el número de visualizaciones, el número de veces que ese coche ha sido marcado como favorito por parte de nuestros usuarios y el número de chats que tienes asociado a ese coche. Verás la fecha de publicación y de modificación. Si tienes el coche descatado o con un destacado planeado verás un contador que te indica los días y las horas que ese coche va a estar destacado. Si lo has planeado verás la fecha inicio y fecha fin de cuando ese coche va a estar destacado.'
      }]
    }]
  };

  constructor(@Inject(LOCALE_ID) private locale: string,
              private router: Router) {
    router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const tree = router.parseUrl(router.url);
        if (tree.fragment) {
          const element = document.querySelector('#' + tree.fragment);
          if (element) {
            element.scrollIntoView(true);
          }
        }
      }
    });
  }

  ngOnInit() {
  }

}
