export interface PaginatedResults<T> {
  results: T[];
  totalAmount: number;
  pageNumber: number;
  pageSize: number;
  firstItemIndexList: number;
  lastItemIndexList: number;
  amountPagesList: number[];
}
