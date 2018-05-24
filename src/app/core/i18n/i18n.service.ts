import { Inject, Injectable, LOCALE_ID } from '@angular/core';

@Injectable()
export class I18nService {

  protected translations: any = {
    en: {
      daysMomentConfig: {
        lastDay: '[Yesterday]',
        sameDay: '[Today] - HH:mm',
        nextDay: '[Tomorrow]',
        lastWeek: 'dddd',
        nextWeek: 'dddd',
        sameElse: 'Do [of] MMMM'
      },
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
      ExtensionNotAllowed: 'You tried to upload an inadequate format. Only photos in JPG or JPEG formats are accepted: ',
      MaxUploadsExceeded: 'This file exceeds the limit of photos: ',
      MaxSizeExceeded: 'This file exceeds the limit of size: ',
      serverError: 'Server error: ',
      productCreated: 'The product has been created successfully!',
      missingImageError: 'You should upload at least one image',
      errorPurchasingItems: 'It was not possible to feature these products: ',
      formErrors: 'Check the red fields',
      formErrorsTitle: 'Oops!',
      userEdited: 'Your data has been edited correctly',
      notValidPassword: 'Current password is not valid',
      passwordMatch: 'Passwords don\'t match',
      itemUpdated: 'The item has been updated correctly',
      imageUploaded: 'Image uploaded!',
      passwordMinLength: 'Password length should be at least 8 characters',
      defaultErrorTitle: 'Oops!',
      defaultSuccessTitle: 'Yup!',
      bumpError: 'Some listings have not been bumped due to an error',
      cantEditError: 'This item can not be modified because has a pending transaction.',
      settingsEdited: 'Your setting has been updated',
      twitterShare: 'Look what I found on @Wallapop:'
    },
    es: {
      daysMomentConfig: {
        lastDay: '[Ayer]',
        sameDay: '[Hoy] - HH:mm',
        nextDay: '[Mañana]',
        lastWeek: 'dddd',
        nextWeek: 'dddd',
        sameElse: 'D [de] MMMM'
      },
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
      reportListingSuccess: 'La publicación se ha denunciado correctamente',
      reportUserSuccess: 'El usuario se ha denunciado correctamente',
      blockUserSuccess: 'El usuario se ha bloqueado correctamente',
      unblockUserSuccess: 'El usuario se ha desbloqueado correctamente',
      newMessageNotification: 'Nuevo mensaje de ',
      date_desc: 'Fecha: descendente',
      date_asc: 'Fecha: ascendente',
      price_desc: 'Precio: descendente',
      price_asc: 'Precio: ascendente',
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
      views: 'Visualizaciones',
      ExtensionNotAllowed: 'Has intentado subir un formato no adecuado. Solo se pueden añadir fotos en jpg o jpeg: ',
      MaxUploadsExceeded: 'Este fichero excede el limite de fotos: ',
      MaxSizeExceeded: 'Este fichero excede el limite de peso: ',
      serverError: 'Error del servidor: ',
      productCreated: 'El producto se ha creado correctamente!',
      missingImageError: 'Tienes que subir por lo menos una imagen',
      errorPurchasingItems: 'No se han podido destacar estos productos:',
      formErrors: 'Revisa los campos en rojo',
      formErrorsTitle: '¡Ojo!',
      userEdited: 'Tus datos se han editado correctamente',
      notValidPassword: 'La contraseña actual no es válida',
      passwordMatch: 'Las contraseñas no coinciden',
      itemUpdated: 'El producto se ha editado correctamente',
      imageUploaded: 'La imagen se ha cargado!',
      passwordMinLength: 'La contraseña tiene que ser de almenos 8 caracteres',
      defaultErrorTitle: '¡Ups!',
      defaultSuccessTitle: '¡Bien!',
      bumpError: 'Algunos productos no se han destacado debido a un error',
      cantEditError: 'Este producto no se puede modificar, porque está en mitad de una transacción.',
      settingsEdited: 'Se ha actualizado tu configuración',
      twitterShare: 'Mira que acabo de encontrar en @Wallapop:'
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
