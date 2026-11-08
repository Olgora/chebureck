export type ProductImage = {
    id: string;
    url: string;
    position: number;
    isMain: boolean;
    isThumbnail: boolean;
};

export type Ingredient = {
  id: string;
  name_pt: string;
  name_en: string | null;
  price: number;
  isAvailable?: boolean;
};

export type Product = {
  id: string;
  name_pt: string;
  name_en: string | null;
  description_pt: string | null;
  description_en: string | null;
  price: number;
  images: ProductImage[];
  categoryId: string,
  currentPrice: number;  
  hasDiscount?: boolean;
  discountText?: string;
  availableIngredients?: Ingredient[];
  
};


export type ProductMenu = {
  id: string;
  name_pt: string;
  name_en: string;
  
  description_pt: string;
  description_en: string;
  price: number;
  images: ProductImage[];

};

 

export type Category = {
  id: string;
  name_pt: string;
  name_en: string | null;
 
  products: Product[];
};

export type Review = {
  id: string;
  name: string;
  phone:string;
  rating:number;
  comment: string | null;
  isVerified: boolean;
  createdAt: Date;
}

export type Language = "en" | "pt" ;

export const languages: Language[] = ["en", "pt"];
 

export function isLanguage(value: string): value is Language {
  return languages.includes(value as Language);
}