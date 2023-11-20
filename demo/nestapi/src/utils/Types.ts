export interface ListResponse<T> {
  list: T[];
  total: number;
  pageStart: number;
  pageSize: number;
}
