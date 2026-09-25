
export interface ICategory {
  _id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IMaterial {
  _id: string;
  type: string;
  name: string;
  price: number;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IColorTheme {
  _id: string;
  name: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICatalogItem {
  _id: string;
  category: string;
  name: string;
  description: string;
  image: string;
  startingPrice: number;
  materials: string[];
  colorThemes: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}