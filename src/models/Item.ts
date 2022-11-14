export type Item = {
  id: string;
  title: string;
  description: string;
  validated: boolean;
  price: number;
  categorie: string;
  images: string[];
  references: string[];
  createdAt: Date;
};
