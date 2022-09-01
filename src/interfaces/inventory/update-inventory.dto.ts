export interface UpdateInventoryDto {
  issueUnit?: string;
  issueUnitPrice?: number;
  issueUnitPerPackSize?: number;
  packSize?: string;
  packSizePrice?: number;
  expirationDate?: Date;
  DrugId?: string;
}
