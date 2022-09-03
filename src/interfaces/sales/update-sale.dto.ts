export interface UpdateSaleDto {
  issueUnitQuantity?: number;
  issueUnitPrice?: number;
  totalPrice?: number;
  status?: string;
  DrugId: string;
  PatientId: string;
}
