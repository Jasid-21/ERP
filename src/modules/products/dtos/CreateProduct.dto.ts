import { productType } from '../types/productTypes';

export interface ICreateProductDto {
  serial: string;
  name: string;
  type: productType;
  description?: string;
  measurement?: number;
  measurementUnit?: string;
  standardCode?: string;
  basePrice?: number;
  companyId: number;
  image?: string;
}
