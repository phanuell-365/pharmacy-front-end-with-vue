export interface NewSaleDto {
  issueUnitQuantity: number;
  issueUnitPrice: number;
  totalPrice: number;
  status?: string;
  DrugId: string;
  PatientId: string;
}
