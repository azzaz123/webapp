import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tsl-payview-promotion-editor',
  templateUrl: './payview-promotion-editor.component.html',
  styleUrls: ['./payview-promotion-editor.component.scss'],
})
export class PayviewPromotionEditorComponent implements OnInit {
  public firstSentence: string;
  public secondSentence: string;

  public ngOnInit(): void {
    const title = $localize`:@@pay_view_buyer_promo_code_pop_up_title:Aplica la promoción. Verás lo bien que sienta.`;
    this.firstSentence = `${title.split('.')[0]}.`;
    this.secondSentence = `${title.split('.')[1]}.`;
  }
  public get errorMessage(): string {
    return null; // return 'El vino que tiene asunción no es blanco ni tinto ni tiene color... asunción asunción vaya tela que tiene el turrón...';
  }

  public get inputLabel(): string {
    return $localize`:@@pay_view_buyer_promo_code_pop_up_placeholder:Código Promocional`;
  }
}
