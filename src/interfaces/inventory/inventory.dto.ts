export interface InventoryDto {
  id: string;
  issueUnit: string;
  issueUnitPrice: number;
  issueUnitPerPackSize: number;
  packSize: string;
  packSizePrice: number;
  expirationDate: Date;
  DrugId: string;
}
