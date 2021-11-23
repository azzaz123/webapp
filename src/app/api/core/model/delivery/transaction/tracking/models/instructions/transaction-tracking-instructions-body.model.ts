import {
  TransactionTrackingInstructionDto,
  TransactionTrackingInstructionsDto,
} from '@api/bff/delivery/transaction-tracking/dtos/responses';
import {
  TransactionTrackingAdditionalInfo,
  TransactionTrackingAdditionalInfoModel,
  TransactionTrackingBanner,
  TransactionTrackingBannerModel,
  TransactionTrackingInstruction,
  TransactionTrackingInstructionModel,
  TransactionTrackingInstructionsBody,
} from '@api/core/model/delivery/transaction/tracking';

export class TransactionTrackingInstructionsBodyModel implements TransactionTrackingInstructionsBody {
  additionalInfo: TransactionTrackingAdditionalInfo;
  banner: TransactionTrackingBanner;
  instructions: TransactionTrackingInstruction[];
  title: string;

  constructor(transactionTrackingInstructionsDto: TransactionTrackingInstructionsDto) {
    this.additionalInfo = !!transactionTrackingInstructionsDto.extra_info
      ? new TransactionTrackingAdditionalInfoModel(transactionTrackingInstructionsDto.extra_info)
      : null;
    this.banner = new TransactionTrackingBannerModel(transactionTrackingInstructionsDto.banner);
    this.instructions = this.getInstructions(transactionTrackingInstructionsDto.instructions);
    this.title = transactionTrackingInstructionsDto.title;
  }

  private getInstructions(instructionsDto: TransactionTrackingInstructionDto[]): TransactionTrackingInstruction[] {
    let instructions: TransactionTrackingInstruction[] = [];
    instructionsDto.forEach((instruction) => {
      instructions.push(new TransactionTrackingInstructionModel(instruction));
    });
    return instructions;
  }
}
