export interface GameDto {
  gameId: string;
  gameName: string;
  categoryId: string;
  categoryName: string;
  createdDate: Date | string;
  updatedDate: Date | string;
  createdBy: string;
  updatedBy: string;
}
