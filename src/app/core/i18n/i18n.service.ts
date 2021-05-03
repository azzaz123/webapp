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
      bulkSoldError: 'Some listings have not been set as sold due to an error',
      phoneCalls: 'Phone calls',
      phones: 'Phones',
      meetings: 'Meetings',
      messages: 'Messages',
      shared: 'Shared Phone',
      missed: 'Missed Call',
      answered: 'Call',
      featured: 'Featured',
      contactMotor:
        ' According to your plan you cannot activate more items. Contact ventas.motor@wallapop.com if you want to increase your plan or deactivate other items in order to activate this one.',
      errorPurchasingItems: 'It was not possible to feature these products: ',
      settingsEdited: 'Your setting has been updated',
      twitterShare: 'Look what I found on @Wallapop:',
      countrybump: 'Country Bump',
      zonebump: 'City Bump',
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
      errorSavingData: 'Error while saving data. Please try again',

      // TODO: Remove when not shared
      citybump: 'City Bump',
    },
    es: {
      defaultErrorMessage: 'Servicio no disponible temporalmente. Inténtelo de nuevo más tarde',
      bulkSoldError: 'Algunos productos no se han marcado como vendido debido a un error',
      phoneCalls: 'Llamadas',
      phones: 'Teléfonos',
      meetings: 'Citas',
      messages: 'Mensajes',
      shared: 'Teléfono compartido',
      missed: 'Llamada perdida',
      answered: 'Llamada recibida',
      featured: 'Destacado',
      contactMotor:
        ' ¡Ojo! De acuerdo con tu plan no puedes activar más productos. Contacta con ventas.motor@wallapop.com si quieres aumentar tu plan o bien desactiva otro producto para poder activar este.',
      errorPurchasingItems: 'No se han podido destacar estos productos:',
      settingsEdited: 'Se ha actualizado tu configuración',
      twitterShare: 'Mira que acabo de encontrar en @Wallapop:',
      zonebump: 'Destacado Ciudad',
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
      errorSavingData: 'Error al guardar los datos. Intenta de nuevo',

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
