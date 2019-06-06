import { Inject, Injectable, LOCALE_ID } from '@angular/core';

@Injectable()
export class I18nService {

  protected translations: any = {
    en: {
      daysMomentConfig: {
        lastDay: '[Yesterday] - HH:mm',
        sameDay: '[Today] - HH:mm',
        nextDay: '[Tomorrow]',
        lastWeek: 'dddd - HH:mm',
        nextWeek: 'dddd',
        sameElse: 'Do [of] MMMM',
        mediumDate: 'MMM d, y'
      },
      momentFormat: 'Do [of] MMMM',
      reportListingReasons: [
        {id: 2, label: 'People or animals'},
        {id: 3, label: 'Joke'},
        {id: 4, label: 'Fake product'},
        {id: 5, label: 'Explicit content'},
        {id: 6, label: 'Doesn\'t match with the image'},
        {id: 7, label: 'Food or drinks'},
        {id: 8, label: 'Drugs or medicines'},
        {id: 9, label: 'Doubled product'},
        {id: 10, label: 'Forbidden product or service'},
        {id: 11, label: 'Resale (tickets, etc)'},
        {id: 12, label: 'Ad or spam'},
      ],
      reportUserReasons: [
        {id: 4, label: 'Suspicious behaviour'},
        {id: 3, label: 'Scam'},
        {id: 6, label: 'No-show'},
        {id: 5, label: 'Bad behaviour'},
        {id: 7, label: 'Defective or wrong item'},
        {id: 0, label: 'Other concern'},
      ],
      archiveConversationSuccess: 'The conversation has been archived correctly',
      unarchiveConversationSuccess: 'The conversation has been unarchived correctly',
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
      ExtensionNotAllowed: 'You tried to upload an inadequate format. Only photos in JPG or JPEG formats are accepted: ',
      MaxUploadsExceeded: 'This file exceeds the limit of photos: ',
      MaxSizeExceeded: 'This file exceeds the limit of size: ',
      serverError: 'Server error: ',
      productCreated: 'The product has been created successfully!',
      missingImageError: 'You should upload at least one image',
      errorPurchasingItems: 'It was not possible to feature these products: ',
      formErrors: 'Check the red fields',
      formErrorsTitle: 'Oops!',
      linkError: 'The web link is not valid',
      userEdited: 'Your data has been edited correctly',
      notValidPassword: 'Current password is not valid',
      passwordMatch: 'Passwords don\'t match',
      itemUpdated: 'The item has been updated correctly',
      imageUploaded: 'Image uploaded!',
      passwordMinLength: 'Password length should be at least 8 characters',
      defaultErrorTitle: 'Oops!',
      defaultSuccessTitle: 'Yup!',
      bumpError: 'Some listings have not been bumped due to an error',
      addNewCardError: 'This card could not be added',
      getStripeCardsError: 'Your cards could not be retrieved',
      cantEditError: 'This item can not be modified because has a pending transaction.',
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
      alreadyFeatured: 'You are trying to feature an item that is already planned.',
      phoneRequestMessage: 'Please contact us or leave us your phone number and we will contact you',
      phoneMessage: 'My phone number is ',
      motorPlanTypes: [
        {subtype: 'sub_pro_basic', label: 'Pro'},
        {subtype: 'cars_3_to_5', label: '3 to 5 cars Plan'},
        {subtype: 'cars_6_to_7', label: '6 to 7 cars Plan'},
        {subtype: 'cars_8_to_10', label: '8 to 10 cars Plan'},
        {subtype: 'cars_11_to_15', label: '11 to 15 cars Plan'},
        {subtype: 'sub_basic', label: 'Basic Motor Plan', shortLabel: 'Basic'},
        {subtype: 'sub_pro', label: 'Medium Motor Plan', shortLabel: 'Medium'},
        {subtype: 'sub_premium', label: 'Super Motor Plan', shortLabel: 'Super'}
      ],
      cars_subscription_tutorial_listinglimit5: 'Upload 5 cars.',
      cars_subscription_tutorial_listinglimit9: 'Upload 9 cars.',
      cars_subscription_tutorial_listinglimit15: 'Upload 15 cars.',
      cars_subscription_tutorial_description2: 'Buyers can save your shop/profile as a favorite.',
      pro_subscription_tutorial_extra_fields_phone_web: 'Buyers will be able to see your phone and website in your profile for easy contact.',
      pro_subscription_tutorial_extra_fields_description_direction: 'You will have a description of your store or service and its location.',
      cars_subscription_tutorial_description3: 'You will have a different design and will stand out!',
      pro_subscription_tutorial_items_no_expire: 'Your items won\'t expire.',
      cars_subscription_tutorial_phone_on_car: 'Your phone will appear in each car you have listed, so more buyers will contact you.',
      brand: 'Brand',
      model: 'Model',
      brand_example: 'E.g: Apple',
      model_example: 'E.g: iPhone'
    },
    es: {
      daysMomentConfig: {
        lastDay: '[Ayer] - HH:mm',
        sameDay: '[Hoy] - HH:mm',
        nextDay: '[Mañana]',
        lastWeek: 'dddd - HH:mm',
        nextWeek: 'dddd',
        sameElse: 'D [de] MMMM',
        mediumDate: 'd MMM y'
      },
      momentFormat: 'D [de] MMMM',
      reportListingReasons: [
        {id: 2, label: 'Personas o Animales'},
        {id: 3, label: 'Broma'},
        {id: 4, label: 'Producto Falso'},
        {id: 5, label: 'Contenido explícito'},
        {id: 6, label: 'La foto no coincide'},
        {id: 7, label: 'Alimentos o bebidas'},
        {id: 8, label: 'Drogas o medicinas'},
        {id: 9, label: 'Producto duplicado'},
        {id: 10, label: 'Producto o servicio prohibido'},
        {id: 11, label: 'Reventa (entradas, etc)'},
        {id: 12, label: 'Publicidad o spam'}
      ],
      reportUserReasons: [
        {id: 4, label: 'Sospecha de fraude'},
        {id: 3, label: 'Fraude'},
        {id: 6, label: 'No asistencia a la cita'},
        {id: 5, label: 'Mal comportamiento o abuso'},
        {id: 7, label: 'Artículo defectuoso o incorrecto'},
        {id: 0, label: 'Otras causas'},
      ],
      archiveConversationSuccess: 'La conversación se ha archivado correctamente',
      unarchiveConversationSuccess: 'La conversación se ha desarchivado correctamente',
      reportListingSuccess: 'La publicación se ha denunciado correctamente',
      reportUserSuccess: 'El usuario se ha denunciado correctamente',
      blockUserSuccess: 'El usuario se ha bloqueado correctamente',
      unblockUserSuccess: 'El usuario se ha desbloqueado correctamente',
      newMessageNotification: 'Nuevo mensaje de ',
      date_desc: 'Más recientes',
      date_asc: 'Más antiguos',
      price_desc: 'Precio mayor',
      price_asc: 'Precio menor',
      bulkDeleteError: 'Algunos productos no se han eliminado debido a un error',
      bulkReserveError: 'Algunos productos no se han reservado debido a un error',
      bulkSoldError: 'Algunos productos no se han marcado como vendido debido a un error',
      phonesShared: 'Teléfonos compartidos',
      phoneCalls: 'Llamadas',
      phones: 'Teléfonos',
      meetings: 'Citas',
      messages: 'Mensajes',
      shared: 'Teléfono compartido',
      missed: 'Llamada perdida',
      answered: 'Llamada recibida',
      chats: 'Chats',
      sold: 'Vendido',
      minute: 'minuto',
      hour: 'hora',
      day: 'día',
      left: 'Quedan',
      views: 'Visualizaciones',
      favorites: 'Favoritos',
      featured: 'Destacado',
      cityFeatured: 'Destacados ciudad',
      countryFeatured: 'Destacados país',
      ExtensionNotAllowed: 'Has intentado subir un formato no adecuado. Solo se pueden añadir fotos en jpg o jpeg: ',
      MaxUploadsExceeded: 'Este fichero excede el limite de fotos: ',
      MaxSizeExceeded: 'Este fichero excede el limite de peso: ',
      serverError: 'Error del servidor: ',
      productCreated: 'El producto se ha creado correctamente!',
      missingImageError: 'Tienes que subir por lo menos una imagen',
      errorPurchasingItems: 'No se han podido destacar estos productos:',
      formErrors: 'Revisa los campos en rojo',
      formErrorsTitle: '¡Ojo!',
      linkError: 'La web no es válida',
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
      cantEditError: 'Este producto no se puede modificar, porque está en mitad de una transacción.',
      settingsEdited: 'Se ha actualizado tu configuración',
      last30Days: 'Últimos 30 días',
      last15Days: 'Últimos 15 días',
      last7Days: 'Últimos 7 días',
      twitterShare: 'Mira que acabo de encontrar en @Wallapop:',
      countrybump: 'Destacado País',
      citybump: 'Destacado Ciudad',
      zonebump: 'Destacado Ciudad',
      deleteBillingInfoSuccess: 'Tu información de facturación ha sido borrada',
      deleteBillingInfoError: 'Hubo un error borrando tu información de facturación',
      packError: 'Hubo un error al comprar este paquete',
      alreadyFeatured: '¡Ups! Estás intentando destacar un item que ya tiene planificados',
      phoneRequestMessage: 'Por favor contáctanos o deja tu número de teléfono y te contactaremos',
      phoneMessage: 'Mi número de teléfono es ',
      motorPlanTypes: [
        {subtype: 'sub_pro_basic', label: 'Pro'},
        {subtype: 'cars_3_to_5', label: 'Plan de 3 a 5 coches'},
        {subtype: 'cars_6_to_7', label: 'Plan de 6 a 7 coches'},
        {subtype: 'cars_8_to_10', label: 'Plan de 8 a 10 coches'},
        {subtype: 'cars_11_to_15', label: 'Plan de 11 a 15 coches'},
        {subtype: 'sub_basic', label: 'Plan Motor Básico', shortLabel: 'Básico'},
        {subtype: 'sub_pro', label: 'Plan Motor Medio', shortLabel: 'Medio'},
        {subtype: 'sub_premium', label: 'Plan Motor Super', shortLabel: 'Super'}
      ],
      cars_subscription_tutorial_listinglimit5: 'Publica hasta 5 coches.',
      cars_subscription_tutorial_listinglimit9: 'Publica hasta 9 coches.',
      cars_subscription_tutorial_listinglimit15: 'Publica hasta 15 coches.',
      cars_subscription_tutorial_description2: 'Los compradores podrán guardar tu tienda / perfil como favorito.',
      pro_subscription_tutorial_extra_fields_phone_web: 'Los compradores podrán ver en tu perfil el teléfono y web para contactar fácilmente.',
      pro_subscription_tutorial_extra_fields_description_direction: 'Tendrás una descripción de tu tienda o servicio y su ubicación.',
      cars_subscription_tutorial_description3: 'Tu perfil tendrá un diseño diferente y ¡destacará!',
      pro_subscription_tutorial_items_no_expire: 'Tus productos no caducarán nunca.',
      cars_subscription_tutorial_phone_on_car: 'Tu teléfono aparecerá en cada coche que tengas publicado, así más compradores te contactarán.',
      brand: 'Marca',
      model: 'Modelo',
      brand_example: 'P. ej: Apple',
      model_example: 'P. ej: iPhone',
    }
  };

  constructor(@Inject(LOCALE_ID) private _locale: string) {
  }

  get locale() {
    return this._locale === 'en-US' ? 'en' : this._locale;
  }

  getTranslations(key: string) {
    return this.translations[this.locale][key];
  }

}
