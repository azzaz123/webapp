import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'tsl-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent {

  public features = [{
    title: 'Como destaco un coche',
    desc: '',
    link: 'Destacados-1'
  }, {
    title: 'Como puedo comprar extras',
    desc: '',
    link: 'Destacados-4'
  }, {
    title: 'Tu Plan de visibilidad',
    desc: '',
    link: 'Perfil-5'
  }];

  public faqs = {
    es: [{
      category: 'Perfil',
      questions: [{
        title: '¿Qué información puedo encontrar en mi perfil?',
        text: 'En la parte superior, encontrarás tres secciones: Perfil (información relativa a tu cuenta), datos de facturación y planes de suscripción.'
      }, {
        title: '¿Qué puedo modificar de mi cuenta?',
        text: 'Desde el perfil podrás subir una foto para que tu cuenta quede más completa. Eso sí, recuerda que sólo aceptamos formatos .jpg. Además podrás modificar todos los campos que aparecen incluyendo la ubicación y tu contraseña. Si necesitas cerrar sesión también puedes hacerlo desde aquí. ¿Fácil verdad?'
      }, {
        title: '¿Qué es la información de facturación?',
        text: 'Esta información es la que guardamos cuando se compran destacados "extra" mediante tarjeta de crédito/débito. Todos los campos son obligatorios para asegurar una factura completa a final de mes.'
      }, {
        title: 'Tu Plan de coches',
        text: 'El plan actual indica el tipo de suscripción que tienes asociado a tus coches. Por ejemplo, si estás suscrito al "Plan 50", significa que puedes tener hasta 50 coches activos al mismo tiempo en la app y web de wallapop. ¿No está mal verdad?'
      }, {
        title: 'Tu Plan de visibilidad',
        text: 'El plan de visibilidad ofrece dos opciones, el plan de ciudad para destacarlo en tu ciudad de residencia y el plan de país para destacar tu coche a nivel nacional. Tienes la posibilidad de comprar 25, 90 o 300 destacados. Cada destacado dura 24 horas. Cuanto más alto sea el pack, mayor es el porcentaje de ahorro. Puedes darte de alta o cambiar a otro llamando al 674 726 372 o enviando un correo a ventas.motor@wallapop.com'
      }, {
        title: '¿Para qué me sirve destacar un coche?',
        text: 'Los destacados permiten que tu coche sea más visible para el resto de usuarios. ¿Cómo? Muy fácil, tener un destacado te permite aparecer en las primeras posiciones del muro de la web y de la app. La ficha de tu producto tendrá una visualización mucho más llamativa y aparecerás en la zona de destacados en toda tu ciudad o país.'
      }]
    }, {
      category: 'Panel',
      questions: [{
        title: '¿Qué información puedo ver en mi panel?',
        text: '¡De todo! Aquí podrás ver desde la información relativa a las visualizaciones, chats y llamadas que genera tu catálogo de coches hasta el impacto que tienen los destacados que apliques sobre las métricas.'
      }, {
        title: '¿Cómo funciona el panel?',
        text: '¡Es muy sencillo! Arriba a la izquierda podrás filtrar por los últimos 30, 15 y 7 días. Si pones el cursor encima de los días verás; los chats, llamadas, visitas y destacados de ese mismo día.'
      }, {
        title: '¿Qué es el panel de los últimos 12 meses?',
        text: 'En este panel podrás ver el resumen del último año. Verás la misma información que en el superior pero separado por meses y sin la posibilidad de filtrar por días.'
      }]
    }, {
      category: 'Catálogo',
      questions: [{
        title: 'Tu Catálogo',
        text: 'En el catálogo tienes toda la información relativa a tus vehículos. Verás que hay varias sub-secciones donde te enseñamos: coches activos en ese momento, los inactivos, los que tienes destacados y los que ya has vendido. En la parte superior tienes un resumen del plan de coches al que estás suscrito, la cantidad de coches que tienes disponibles y la cantidad de coches inactivos. Además puedes ver un resumen de los planes de visibilidad, el saldo de destacados que tienes disponible, los que tienes en uso y cuántos tienes planificados. Recuerda que cada destacado dura 24 horas, así que si tienes un coche destacado durante tres días, te cuenta como 3 destacados planificados.'
      }, {
        title: '¿Qué acciones puedo hacer para cada coche?',
        text: 'Podrás editar, reservar o marcar como vendido un coche de manera individual así como destacarlo, borrarlo o desactivarlo (de manera individual o colectiva).'
      }, {
        title: '¿Puedo ordenar mi catálogo de coches?',
        text: '¡Y tanto! De tres formas diferentes, sólo tiene que seleccionar la que más te convenga; por fecha de creación, los más recientes o por precio (del más alto al más bajo o viceversa).'
      }, {
        title: '¿Puedo buscar dentro de mis productos?',
        text: '¡Cuándo tú quieras! Puedes hacer clic en el icono de la lupa situado a la izquierda y buscar por nombre dentro de tu catálogo el producto que quieras.'
      }, {
        title: '¿Puedo subir un coche de forma manual desde mi catálogo?',
        text: 'Tienes varios botones de acción para subir un coche a tu perfil de wallapop. Encontrarás en la barra superior de la navegación un botón que pone "Subir coche" este mismo botón lo tienes disponible en tu catálogo. Elige el que más te convenga y sube todos los coches que quieras.'
      }, {
        title: '¿Qué información veo en la ficha de mi coche?',
        text: 'Verás la foto, el precio y el modelo del coche así como la fecha de publicación y de la última modificación. Verás también el número de visualizaciones, las veces que tu coche ha sido marcado como favorito por los usuarios y el número de chats que tienes asociado a ese coche. Si tienes el coche destacado o con un destacado planeado verás un contador que te indica los días y las horas que estará destacado. Si lo has planeado verás la fecha de inicio y fin del destacado. Ta,bién podrás marcarlo como vendido, reservado o editarlo.'
      }]
    }, {
      category: 'Destacados',
      questions: [{
        title: '¿Cómo destaco un coche?',
        text: 'Si tienes un plan de visibilidad al que estás suscrito o tienes destacados "extra" podrás utilizarlos de la siguiente forma: selecciona el coche o los coches que quieres destacar y haz clic en el botón que pone "Destácalo"; en el siguiente paso te mostramos los coches que has seleccionado y tendrás que elegir que tipo de destacado quieres aplicar (de ciudad o de país) y los días que quieres destacarlo. Recuerda que los destacados duran 24 horas y que cada 24h se consume uno. Cuando hayas elegido que destacado aplicar a cada producto verás un resumen de toda la información en la parte derecha de la pantalla y un botón final para "Aplicar destacados".'
      }, {
        title: '¿Por qué no tengo habilitado el destacado de país o de ciudad?',
        text: 'Si ves que no puedes seleccionar alguno de los destacados, ya sea el de país o el de ciudad significa que o bien no estás suscrito o que no tienes destacados disponibles. Recuerda que puedes suscribirte a cualquier plan de visibilidad a través del 674 726 372 o enviar un correo a ventas.motor@wallapop.com. Si lo deseas también puedes comprar destacados extra con tarjeta de crédito/débito. Para ello tienes un botón "Comprar extras" en la parte superior derecha de tu catálogo.'
      }, {
        title: '¿Puedo cancelar un destacado?',
        text: 'Sólo puedes cancelar un destacado que está planeado para una fecha futura. Si actualmente tienes un coche destacado no puedes cancelarlo porque los destacados son de 24 horas y ya estaría en curso.'
      }, {
        title: '¿Cómo puedo comprar destacados extra?',
        text: 'Si no estás suscrito a ningún plan de visibilidad o bien ya has consumido todos los destacados de tu plan puedes comprar extras tanto de ciudad como de país. Encontrarás en la parte superior derecha de tu catálogo un botón "Comprar extras"  en el que haciendo clic podrás ver los precios y los packs disponibles. Puedes añadir tantos destacados como quieras y comprarlos con una tarjeta de crédito/débito. Estos destacados se añadirán automáticamente y los podrás utilizar desde ese mismo momento.'
      }]
    }, {
      category: 'Mensajes',
      questions: [{
        title: '¿Qué veo en la pestaña de Mensajes?',
        text: 'Encontrarás un listado con el número de chats que tienes en tu perfil. Los mensajes se dividen en pendientes, que son los que estás gestionando y los procesados, que son los que ya has gestionado. Cada chat hace referencia a la conversación que tienes por coche y usuario.'
      }, {
        title: '¿Qué acciones puedo hacer desde Mensajes?',
        text: 'Desde esta sección puedes procesar los mensajes que aparecen en pendientes y que ya has respondido y viceversa. Lo único que tienes que hacer es poner el cursor en el chat que quieras procesar o devolver a pendiente. Aparecerá un tick en la parte derecha, si lo clicas pasará a la sección de procesado o al revés. También puedes borrar una conversación, reportar a un usuario o bloquearlo. A la derecha verás información relativa al usuario.'
      }, {
        title: '¿Puedo bloquear o denunciar a un usuario que no quiero que me hable?',
        text: 'Sí. Dentro de la conversación que tienes con el usuario, verás un menú de tres puntitos verticales en la parte superior derecha. Ahí podrás denunciar el producto, reportar al usuario, bloquearlo y borrar la conversación. De esta forma no podrá volver a contactarte y tu denuncia quedará registrada.'
      }]
    }, {
      category: 'Llamadas',
      questions: [{
        title: '¿Qué información encuentro en la sección de llamadas?',
        text: 'Al igual que en mensajes, en este apartado se recogen todas las llamadas, procesadas y pendientes.'
      }, {
        title: '¿Qué hay en las llamadas pendientes?',
        text: 'Encontrarás todas las llamadas que te han hecho, incluyendo las perdidas y los números de teléfono compartidos. Podrás ver quién ha hecho la llamada, la fecha de la llamada, la duración de la misma y podrás procesarla.'
      }, {
        title: '¿Qué significa cada icono de teléfono?',
        text: 'Verás que tienes tres tipos de iconos que hacen referencia a un teléfono. El verde, significa que la llamada ha sido recibida. El rojo, significa que el usuario te ha llamado pero no has respondido y el teléfono azul es para todos los usuarios que han querido compartir su número contigo.'
      }, {
        title: '¿Puedo ver información adicional del usuario que me llama?',
        text: 'Cada línea de llamada se puede extender y podrás ver información relativa al usuario que te ha llamado o ha compartido su teléfono. Podrás ver la valoración, la distancia y si ha recibido denuncias. Asimismo podrás ver si tienes un chat pendiente con el usuario y acceder directamente a la conversación.'
      }, {
        title: '¿Para qué sirven las llamadas procesadas?',
        text: 'Las llamadas procesadas las gestionas tu mismo/a. Tienes la posibilidad de marcar cada llamada como gestionada y pasarán a la pestaña de procesadas. Todas aquellas llamadas que has realizado, recibido o devuelto las puedes marcar como procesadas para una mejor organización.'
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

}
