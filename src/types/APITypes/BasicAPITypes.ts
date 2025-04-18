export interface IMetaPagination {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface IPaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  price?: number;
}
