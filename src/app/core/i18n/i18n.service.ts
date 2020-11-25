import { Inject, Injectable, LOCALE_ID } from '@angular/core';

@Injectable()
export class I18nService {
  protected translations: any = {
    en: {
      yes: 'Yes',
      no: 'No',
      defaultErrorMessage:
        'Service not available at this moment. Try again later',
      male: 'Male',
      female: 'Female',
      daysMomentConfig: {
        lastDay: '[Yesterday] - HH:mm',
        sameDay: '[Today] - HH:mm',
        nextDay: '[Tomorrow]',
        lastWeek: 'dddd - HH:mm',
        nextWeek: 'dddd',
        sameElse: 'MMM DD, YYYY',
      },
      defaultDaysMomentConfig: {
        lastDay: '[Yesterday]',
        sameDay: '[Today]',
        nextDay: 'dddd, D MMM',
        lastWeek: 'dddd, D MMM',
        nextWeek: 'dddd, D MMM',
        sameElse: 'dddd, D MMM',
      },
      momentFormat: 'Do [of] MMMM',
      reportListingReasons: [
        { id: 2, label: 'People or animals' },
        { id: 3, label: 'Joke' },
        { id: 4, label: 'Fake product' },
        { id: 5, label: 'Explicit content' },
        { id: 6, label: "Doesn't match with the image" },
        { id: 7, label: 'Food or drinks' },
        { id: 8, label: 'Drugs or medicines' },
        { id: 9, label: 'Doubled product' },
        { id: 10, label: 'Forbidden product or service' },
        { id: 11, label: 'Resale (tickets, etc)' },
        { id: 12, label: 'Ad or spam' },
      ],
      reportUserReasons: [
        { id: 4, label: 'Suspicious behaviour' },
        { id: 3, label: 'Scam' },
        { id: 6, label: 'No-show' },
        { id: 5, label: 'Bad behaviour' },
        { id: 7, label: 'Defective or wrong item' },
        { id: 0, label: 'Other concern' },
      ],
      archiveConversationSuccess:
        'The conversation has been archived correctly',
      unarchiveConversationSuccess:
        'The conversation has been unarchived correctly',
      reportListingSuccess: 'The listing has been reported correctly',
      reportUserSuccess: 'The user has been reported correctly',
      blockUserSuccess: 'The user has been blocked',
      unblockUserSuccess: 'The user has been unblocked',
      newMessageNotification: 'New message from ',
      date_desc: 'Date: from recent to old',
      date_asc: 'Date: from old to recent',
      price_desc: 'Price: from high to low',
      price_asc: 'Price:  from low to high',
      bulkDeleteError: 'Some listings have not been deleted due to an error',
      bulkReserveError: 'Some listings have not been reserved due to an error',
      bulkSoldError: 'Some listings have not been set as sold due to an error',
      phonesShared: 'Shared phones',
      phoneCalls: 'Phone calls',
      phones: 'Phones',
      meetings: 'Meetings',
      messages: 'Messages',
      shared: 'Shared Phone',
      missed: 'Missed Call',
      answered: 'Call',
      chats: 'Chats',
      sold: 'Sold',
      views: 'Views',
      minute: 'minute',
      hour: 'hour',
      day: 'day',
      left: 'left',
      favorites: 'Favorites',
      featured: 'Featured',
      ExtensionNotAllowed:
        'You tried to upload an inadequate format. Only photos in JPG or JPEG formats are accepted: ',
      MaxUploadsExceeded: 'This file exceeds the limit of photos: ',
      MaxSizeExceeded: 'This file exceeds the limit of size: ',
      serverError: 'Server error: ',
      productCreated: 'The product has been created successfully!',
      contactMotor:
        ' According to your plan you cannot activate more items. Contact ventas.motor@wallapop.com if you want to increase your plan or deactivate other items in order to activate this one.',
      missingImageError: 'You should upload at least one image',
      suggestedCategory:
        'It seems that your product belongs to another category, so we’ve changed it.',
      errorPurchasingItems: 'It was not possible to feature these products: ',
      formErrors: 'Check the red fields',
      formErrorsTitle: 'Oops!',
      linkError: 'The web link is not valid',
      phoneNumberError: 'The phone number has an invalid format',
      userEdited: 'Your data has been edited correctly',
      notValidPassword: 'Current password is not valid',
      passwordMatch: "Passwords don't match",
      itemUpdated: 'The item has been updated correctly',
      imageUploaded: 'Image uploaded!',
      passwordMinLength: 'Password length should be at least 8 characters',
      defaultErrorTitle: 'Oops!',
      defaultSuccessTitle: 'Yup!',
      bumpError: 'Some listings have not been bumped due to an error',
      addNewCardError: 'This card could not be added',
      getStripeCardsError: 'Your cards could not be retrieved',
      cantEditError:
        'This item can not be modified because has a pending transaction.',
      settingsEdited: 'Your setting has been updated',
      last30Days: 'Last 30 days',
      last15Days: 'Last 15 days',
      last7Days: 'Last 7 days',
      twitterShare: 'Look what I found on @Wallapop:',
      countrybump: 'Country Bump',
      citybump: 'City Bump',
      zonebump: 'City Bump',
      deleteBillingInfoSuccess: 'Your billing info has been deleted',
      deleteBillingInfoError: 'There was a error deleting your billing info',
      packError: 'There was a error buying this pack',
      noCardSelectedError: 'Please select a credit card',
      alreadyFeatured:
        'You are trying to feature an item that is already planned.',
      phoneMessage: 'My phone number is ',
      cars_subscription_tutorial_listinglimit5: 'Upload 5 cars.',
      cars_subscription_tutorial_listinglimit9: 'Upload 9 cars.',
      cars_subscription_tutorial_listinglimit15: 'Upload 15 cars.',
      cars_subscription_tutorial_description2:
        'Buyers can save your shop/profile as a favorite.',
      pro_subscription_tutorial_extra_fields_phone_web:
        'Buyers will be able to see your phone and website in your profile for easy contact.',
      pro_subscription_tutorial_extra_fields_description_direction:
        'You will have a description of your store or service and its location.',
      cars_subscription_tutorial_description3:
        'You will have a different design and will stand out!',
      pro_subscription_tutorial_items_no_expire: "Your items won't expire.",
      cars_subscription_tutorial_phone_on_car:
        'Your phone will appear in each car you have listed, so more buyers will contact you.',
      brand: 'Brand',
      model: 'Model',
      phones_brand_example: 'E.g: Apple',
      fashion_brand_example: 'E.g: Zara',
      model_example: 'E.g: iPhone',
      noResultsFound: 'No results found',
      writeMessage: 'Write a message...',
      disableMessage: 'Conversation disabled',
      selling: 'Selling',
      active: 'Active',
      inactive: 'Inactive',
      searchDefault: 'Search items',
      searchByTitle: 'Search by title',
      editSubscriptionSuccessTitle: 'Great!',
      editSubscriptionSuccessBody:
        'Your subscription has been edited correctly.',
      editSubscriptionErrorTitle: 'Error:',
      editSubscriptionErrorBody: 'Your subscription could not be edited.',
      cancelSubscriptionSuccessTitle: 'Subscription cancelled.',
      cancelSubscriptionSuccessBody: 'We are sad to see you go.',
      cancelSubscriptionErrorTitle: 'There was an error',
      cancelSubscriptionErrorBody: 'Your subscription could not be cancelled.',
      reviews: 'Reviews',
      continueSubscriptionSuccessTitle: 'Success:',
      continueSubscriptionSuccessBody: 'Your subscription is active again',
      continueSubscriptionErrorTitle: 'Error:',
      continueSubscriptionErrorBody: 'We could not proceed with your request.',
      paymentFailed: 'The payment could not be done',
      consumerGoodsGeneralCategoryTitle: 'Everything else',
      nodata: 'No data available',
      SubscriptionCardNotSet: 'Your card could not be saved',
      SubscriptionCardSet: 'Your card has been saved successfully',
      SubscriptionCardDeleted: 'Your card has been deleted',
      subscriptionBenefits: [
        {
          iconId: 'paintbrush',
          title: 'Professionalize your profile',
          description:
            'Stand out above the rest with a cover photo and a description of what you offer',
        },
        {
          iconId: 'magnet',
          title: 'Connect with more clients',
          description:
            'Share with millions of potential buyers your phone and website',
        },
        {
          iconId: 'watch',
          title: 'Without time limit',
          description:
            'Your items will never expire, they will be always ready for a quick sell',
        },
        {
          iconId: 'unlocked',
          title: 'Without compromise',
          description:
            'You can cancel your subscription whenever you want, without penalties',
        },
      ],
      tooManyNewConversations:
        "We can't keep up with you. Wait a moment so you can open up new conversations.",
    },
    es: {
      yes: 'Sí',
      no: 'No',
      defaultErrorMessage:
        'Servicio no disponible temporalmente. Inténtelo de nuevo más tarde',
      male: 'Hombre',
      female: 'Mujer',
      daysMomentConfig: {
        lastDay: '[Ayer] - HH:mm',
        sameDay: '[Hoy] - HH:mm',
        nextDay: '[Mañana]',
        lastWeek: 'dddd - HH:mm',
        nextWeek: 'dddd',
        sameElse: 'MMM DD, YYYY',
      },
      defaultDaysMomentConfig: {
        lastDay: '[Ayer]',
        sameDay: '[Hoy]',
        nextDay: 'dddd, D MMM',
        lastWeek: 'dddd, D MMM',
        nextWeek: 'dddd, D MMM',
        sameElse: 'dddd, D MMM',
      },
      momentFormat: 'D [de] MMMM',
      reportListingReasons: [
        { id: 2, label: 'Personas o Animales' },
        { id: 3, label: 'Broma' },
        { id: 4, label: 'Producto Falso' },
        { id: 5, label: 'Contenido explícito' },
        { id: 6, label: 'La foto no coincide' },
        { id: 7, label: 'Alimentos o bebidas' },
        { id: 8, label: 'Drogas o medicinas' },
        { id: 9, label: 'Producto duplicado' },
        { id: 10, label: 'Producto o servicio prohibido' },
        { id: 11, label: 'Reventa (entradas, etc)' },
        { id: 12, label: 'Publicidad o spam' },
      ],
      reportUserReasons: [
        { id: 4, label: 'Sospecha de fraude' },
        { id: 3, label: 'Fraude' },
        { id: 6, label: 'No asistencia a la cita' },
        { id: 5, label: 'Mal comportamiento o abuso' },
        { id: 7, label: 'Artículo defectuoso o incorrecto' },
        { id: 0, label: 'Otras causas' },
      ],
      archiveConversationSuccess:
        'La conversación se ha archivado correctamente',
      unarchiveConversationSuccess:
        'La conversación se ha desarchivado correctamente',
      reportListingSuccess: 'La publicación se ha denunciado correctamente',
      reportUserSuccess: 'El usuario se ha denunciado correctamente',
      blockUserSuccess: 'El usuario se ha bloqueado correctamente',
      unblockUserSuccess: 'El usuario se ha desbloqueado correctamente',
      newMessageNotification: 'Nuevo mensaje de ',
      date_desc: 'Más recientes',
      date_asc: 'Más antiguos',
      price_desc: 'Precio mayor',
      price_asc: 'Precio menor',
      bulkDeleteError:
        'Algunos productos no se han eliminado debido a un error',
      bulkReserveError:
        'Algunos productos no se han reservado debido a un error',
      bulkSoldError:
        'Algunos productos no se han marcado como vendido debido a un error',
      phonesShared: 'Teléfonos compartidos',
      phoneCalls: 'Llamadas',
      phones: 'Teléfonos',
      meetings: 'Citas',
      messages: 'Mensajes',
      shared: 'Teléfono compartido',
      missed: 'Llamada perdida',
      answered: 'Llamada recibida',
      chats: 'Chats',
      sold: 'Vendidos',
      minute: 'minuto',
      hour: 'hora',
      day: 'día',
      left: 'Quedan',
      views: 'Visualizaciones',
      favorites: 'Favoritos',
      featured: 'Destacado',
      cityFeatured: 'Destacados ciudad',
      countryFeatured: 'Destacados país',
      ExtensionNotAllowed:
        'Has intentado subir un formato no adecuado. Solo se pueden añadir fotos en jpg o jpeg: ',
      MaxUploadsExceeded: 'Este fichero excede el limite de fotos: ',
      MaxSizeExceeded: 'Este fichero excede el limite de peso: ',
      serverError: 'Error del servidor: ',
      productCreated: 'El producto se ha creado correctamente!',
      contactMotor:
        ' ¡Ojo! De acuerdo con tu plan no puedes activar más productos. Contacta con ventas.motor@wallapop.com si quieres aumentar tu plan o bien desactiva otro producto para poder activar este.',
      missingImageError: 'Tienes que subir por lo menos una imagen',
      suggestedCategory:
        'Todo indica que tu producto corresponde a otra categoría, por eso la hemos cambiado.',
      errorPurchasingItems: 'No se han podido destacar estos productos:',
      formErrors: 'Revisa los campos en rojo',
      formErrorsTitle: '¡Ojo!',
      linkError: 'La web no es válida',
      phoneNumberError: 'El número de teléfono tiene un formato inválido',
      userEdited: 'Tus datos se han editado correctamente',
      notValidPassword: 'La contraseña actual no es válida',
      passwordMatch: 'Las contraseñas no coinciden',
      itemUpdated: 'El producto se ha editado correctamente',
      imageUploaded: 'La imagen se ha cargado!',
      passwordMinLength: 'La contraseña tiene que ser de almenos 8 caracteres',
      defaultErrorTitle: '¡Ups!',
      defaultSuccessTitle: '¡Bien!',
      bumpError: 'Algunos productos no se han destacado debido a un error',
      addNewCardError: 'La tarjeta no ha podido ser guardada',
      getStripeCardsError: 'No se han podido mostrar tus tarjetas',
      cantEditError:
        'Este producto no se puede modificar, porque está en mitad de una transacción.',
      settingsEdited: 'Se ha actualizado tu configuración',
      last30Days: 'Últimos 30 días',
      last15Days: 'Últimos 15 días',
      last7Days: 'Últimos 7 días',
      twitterShare: 'Mira que acabo de encontrar en @Wallapop:',
      countrybump: 'Destacado País',
      citybump: 'Destacado Ciudad',
      zonebump: 'Destacado Ciudad',
      deleteBillingInfoSuccess: 'Tu información de facturación ha sido borrada',
      deleteBillingInfoError:
        'Hubo un error borrando tu información de facturación',
      packError: 'Hubo un error al comprar este paquete',
      noCardSelectedError: 'Por favor selecciona una tarjeta de crédito',
      alreadyFeatured:
        '¡Ups! Estás intentando destacar un item que ya tiene planificados',
      phoneMessage: 'Mi número de teléfono es ',
      cars_subscription_tutorial_listinglimit5: 'Publica hasta 5 coches.',
      cars_subscription_tutorial_listinglimit9: 'Publica hasta 9 coches.',
      cars_subscription_tutorial_listinglimit15: 'Publica hasta 15 coches.',
      cars_subscription_tutorial_description2:
        'Los compradores podrán guardar tu tienda / perfil como favorito.',
      pro_subscription_tutorial_extra_fields_phone_web:
        'Los compradores podrán ver en tu perfil el teléfono y web para contactar fácilmente.',
      pro_subscription_tutorial_extra_fields_description_direction:
        'Tendrás una descripción de tu tienda o servicio y su ubicación.',
      cars_subscription_tutorial_description3:
        'Tu perfil tendrá un diseño diferente y ¡destacará!',
      pro_subscription_tutorial_items_no_expire:
        'Tus productos no caducarán nunca.',
      cars_subscription_tutorial_phone_on_car:
        'Tu teléfono aparecerá en cada coche que tengas publicado, así más compradores te contactarán.',
      brand: 'Marca',
      model: 'Modelo',
      phones_brand_example: 'P. ej: Apple',
      fashion_brand_example: 'P. ej: Zara',
      model_example: 'P. ej: iPhone',
      noResultsFound: 'No hay resultados',
      writeMessage: 'Escribe un mensaje...',
      disableMessage: 'Conversación deshabilitada',
      selling: 'En venta',
      active: 'Activos',
      inactive: 'Inactivos',
      searchDefault: 'Busca productos',
      searchByTitle: 'Buscar por título',
      editSubscriptionSuccessTitle: '¡Bien!',
      editSubscriptionSuccessBody:
        'Tu suscripción se ha editado correctamente.',
      editSubscriptionErrorTitle: 'Ha habido un error:',
      editSubscriptionErrorBody: 'Tu suscripción no ha podido ser modificada.',
      cancelSubscriptionSuccessTitle: 'Suscripción cancelada.',
      cancelSubscriptionSuccessBody: 'Lamentamos que te vayas :(',
      cancelSubscriptionErrorTitle: 'Ha habido un error',
      cancelSubscriptionErrorBody: 'Tu suscripción no ha podido ser cancelada.',
      reviews: 'Opiniones',
      continueSubscriptionSuccessTitle: '¡Bien!',
      continueSubscriptionSuccessBody:
        'Tu suscripción se ha activado de nuevo.',
      continueSubscriptionErrorTitle: 'Ha habido un error',
      continueSubscriptionErrorBody:
        'Tu suscripción no ha podido ser restablecida.',
      paymentFailed: 'No ha podido realizarse el pago',
      consumerGoodsGeneralCategoryTitle: 'Todo lo demás',
      nodata: 'No hay datos disponibles',
      SubscriptionCardNotSet: 'Tu tarjeta no ha podido ser guardada',
      SubscriptionCardSet: 'Tu tarjeta se ha guardado correctamente',
      SubscriptionCardDeleted: 'Tu tarjeta se ha borrado correctamente',
      subscriptionBenefits: [
        {
          iconId: 'paintbrush',
          title: 'Profesionaliza tu perfil',
          description:
            'Destaca sobre el resto con una foto portada y una descripción de lo que ofreces',
        },
        {
          iconId: 'magnet',
          title: 'Conecta con más clientes',
          description:
            'Comparte con millones de potenciales compradores tu teléfono y tu página web',
        },
        {
          iconId: 'watch',
          title: 'Sin límite de tiempo',
          description:
            'Tus artículos no expiran nunca, siempre están disponibles para una venta rápida',
        },
        {
          iconId: 'unlocked',
          title: 'Sin compromiso',
          description:
            'Puedes cancelar la suscripción cuando quieras, sin penalizaciones de ningún tipo',
        },
      ],
      tooManyNewConversations:
        'No te podemos seguir el ritmo. Espera un momento para poder abrir nuevas conversaciones.',
    },
  };

  constructor(@Inject(LOCALE_ID) private _locale: string) {}

  get locale() {
    return this._locale === 'en-US' ? 'en' : this._locale;
  }

  getTranslations(key: string) {
    return this.translations[this.locale][key];
  }
}
