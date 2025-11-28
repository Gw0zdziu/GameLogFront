export interface CategoryDto{
  categoryId: string;
  categoryName: string;
  description: string;
  createdDate: Date | string;
  updatedDate: Date | string;
  createdBy: string;
  updatedBy: string;
  gamesCount: number;
}
