export interface BumpsPackageUseDTO {
  bumps: BumpPackageUseDTO[];
}

export interface BumpPackageUseDTO {
  id: string;
  item_id: string;
  type: string;
  duration_days: number;
}
