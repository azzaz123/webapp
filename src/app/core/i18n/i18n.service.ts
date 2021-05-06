import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { translations } from './translations/constants/translations';
import { TRANSLATION_KEY } from './translations/enum/translation-keys.enum';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  protected translations: any = {
    en: {
      defaultErrorMessage: 'Service not available at this moment. Try again later',
      bulkDeleteError: 'Some listings have not been deleted due to an error',
      bulkReserveError: 'Some listings have not been reserved due to an error',
      bulkSoldError: 'Some listings have not been set as sold due to an error',
      phoneCalls: 'Phone calls',
      phones: 'Phones',
      meetings: 'Meetings',
      messages: 'Messages',
      shared: 'Shared Phone',
      missed: 'Missed Call',
      answered: 'Call',
      featured: 'Featured',
      ExtensionNotAllowed: 'You tried to upload an inadequate format. Only photos in JPG or JPEG formats are accepted: ',
      MaxUploadsExceeded: 'This file exceeds the limit of photos: ',
      MaxSizeExceeded: 'This file exceeds the limit of size: ',
      serverError: 'Server error: ',
      productCreated: 'The product has been created successfully!',
      missingImageError: 'You should upload at least one image',
      suggestedCategory: 'It seems that your product belongs to another category, so we’ve changed it.',
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
      bumpError: 'Some listings have not been bumped due to an error',
      addNewCardError: 'This card could not be added',
      getStripeCardsError: 'Your cards could not be retrieved',
      cantEditError: 'This item can not be modified because has a pending transaction.',
      settingsEdited: 'Your setting has been updated',
      twitterShare: 'Look what I found on @Wallapop:',
      countrybump: 'Country Bump',
      zonebump: 'City Bump',
      deleteBillingInfoSuccess: 'Your billing info has been deleted',
      deleteBillingInfoError: 'There was a error deleting your billing info',
      packError: 'There was a error buying this pack',
      noCardSelectedError: 'Please select a credit card',
      alreadyFeatured: 'You are trying to feature an item that is already planned.',
      cars_subscription_tutorial_listinglimit5: 'Upload 5 cars.',
      cars_subscription_tutorial_listinglimit9: 'Upload 9 cars.',
      cars_subscription_tutorial_listinglimit15: 'Upload 15 cars.',
      cars_subscription_tutorial_description2: 'Buyers can save your shop/profile as a favorite.',
      pro_subscription_tutorial_extra_fields_phone_web:
        'Buyers will be able to see your phone and website in your profile for easy contact.',
      pro_subscription_tutorial_extra_fields_description_direction:
        'You will have a description of your store or service and its location.',
      cars_subscription_tutorial_description3: 'You will have a different design and will stand out!',
      pro_subscription_tutorial_items_no_expire: "Your items won't expire.",
      cars_subscription_tutorial_phone_on_car: 'Your phone will appear in each car you have listed, so more buyers will contact you.',
      brand: 'Brand',
      model: 'Model',
      phones_brand_example: 'E.g: Apple',
      fashion_brand_example: 'E.g: Zara',
      model_example: 'E.g: iPhone',
      reviews: 'Reviews',
      paymentFailed: 'Check your card details.',
      paymentFailedUnknown: "For some reason, the payment couldn't be processed. Please try again.",
      paymentFailedToastTitle: 'Something went wrong',
      SubscriptionCardNotSet: 'Your card could not be saved',
      invoiceCorrectlyDownloaded: 'Your invoice has been successfully downloaded',
      invoiceGenerated: 'Your invoice has been successfully generated',
      invoiceCannotDownload: 'Your invoice could not be downloaded. Please try again',
      invoiceCannotGenerate: 'Your invoice could not be generated. Please try again',
      errorSavingData: 'Error while saving data. Please try again',
      deleteItemError: 'There was an error deleting your product',

      // TODO: Remove when not shared
      citybump: 'City Bump',
    },
    es: {
      defaultErrorMessage: 'Servicio no disponible temporalmente. Inténtelo de nuevo más tarde',
      bulkDeleteError: 'Algunos productos no se han eliminado debido a un error',
      bulkReserveError: 'Algunos productos no se han reservado debido a un error',
      bulkSoldError: 'Algunos productos no se han marcado como vendido debido a un error',
      phoneCalls: 'Llamadas',
      phones: 'Teléfonos',
      meetings: 'Citas',
      messages: 'Mensajes',
      shared: 'Teléfono compartido',
      missed: 'Llamada perdida',
      answered: 'Llamada recibida',
      featured: 'Destacado',
      cityFeatured: 'Destacados ciudad',
      countryFeatured: 'Destacados país',
      ExtensionNotAllowed: 'Has intentado subir un formato no adecuado. Solo se pueden añadir fotos en jpg o jpeg: ',
      MaxUploadsExceeded: 'Este fichero excede el limite de fotos: ',
      MaxSizeExceeded: 'Este fichero excede el limite de peso: ',
      serverError: 'Error del servidor: ',
      productCreated: 'El producto se ha creado correctamente!',
      missingImageError: 'Tienes que subir por lo menos una imagen',
      suggestedCategory: 'Todo indica que tu producto corresponde a otra categoría, por eso la hemos cambiado.',
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
      bumpError: 'Algunos productos no se han destacado debido a un error',
      addNewCardError: 'La tarjeta no ha podido ser guardada',
      getStripeCardsError: 'No se han podido mostrar tus tarjetas',
      cantEditError: 'Este producto no se puede modificar, porque está en mitad de una transacción.',
      settingsEdited: 'Se ha actualizado tu configuración',
      twitterShare: 'Mira que acabo de encontrar en @Wallapop:',
      zonebump: 'Destacado Ciudad',
      deleteBillingInfoSuccess: 'Tu información de facturación ha sido borrada',
      deleteBillingInfoError: 'Hubo un error borrando tu información de facturación',
      packError: 'Hubo un error al comprar este paquete',
      noCardSelectedError: 'Por favor selecciona una tarjeta de crédito',
      alreadyFeatured: '¡Ups! Estás intentando destacar un item que ya tiene planificados',
      cars_subscription_tutorial_listinglimit5: 'Publica hasta 5 coches.',
      cars_subscription_tutorial_listinglimit9: 'Publica hasta 9 coches.',
      cars_subscription_tutorial_listinglimit15: 'Publica hasta 15 coches.',
      cars_subscription_tutorial_description2: 'Los compradores podrán guardar tu tienda / perfil como favorito.',
      pro_subscription_tutorial_extra_fields_phone_web:
        'Los compradores podrán ver en tu perfil el teléfono y web para contactar fácilmente.',
      pro_subscription_tutorial_extra_fields_description_direction: 'Tendrás una descripción de tu tienda o servicio y su ubicación.',
      cars_subscription_tutorial_description3: 'Tu perfil tendrá un diseño diferente y ¡destacará!',
      pro_subscription_tutorial_items_no_expire: 'Tus productos no caducarán nunca.',
      cars_subscription_tutorial_phone_on_car:
        'Tu teléfono aparecerá en cada coche que tengas publicado, así más compradores te contactarán.',
      brand: 'Marca',
      model: 'Modelo',
      phones_brand_example: 'P. ej: Apple',
      fashion_brand_example: 'P. ej: Zara',
      model_example: 'P. ej: iPhone',
      reviews: 'Opiniones',
      paymentFailed: 'Revisa los datos de tu tarjeta.',
      paymentFailedUnknown: 'Por alguna razón, el pago no se ha podido realizar. Por favor vuelve a intentarlo.',
      paymentFailedToastTitle: 'Algo ha fallado',
      SubscriptionCardNotSet: 'Tu tarjeta no ha podido ser guardada',
      invoiceCorrectlyDownloaded: 'Tu factura se ha descargado correctamente',
      invoiceGenerated: 'Tu factura se ha generado correctamente',
      invoiceCannotDownload: 'Tu factura no se ha podido descargar. Intenta de nuevo',
      invoiceCannotGenerate: 'Tu factura no se ha podido generar. Intenta de nuevo',
      errorSavingData: 'Error al guardar los datos. Intenta de nuevo',
      deleteItemError: 'Hubo un error borrando tu producto',

      // TODO: Remove when not shared
      citybump: 'City Bump',
    },
  };

  constructor(@Inject(LOCALE_ID) private _locale: string) {}

  get locale() {
    return this._locale === 'en-US' ? 'en' : this._locale;
  }

  // TODO: Remove this method and use only "translate" one
  getTranslations(key: string) {
    return this.translations[this.locale][key];
  }

  public translate(translationKey: TRANSLATION_KEY): string {
    return translations[translationKey];
  }
}
