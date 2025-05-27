export interface IMetaPagination {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface IMetaPurchasePagination extends IMetaPagination {
  total_sxp: number;
}

export interface IMetaFeedbackPagination extends IMetaPagination {
  averageRating: number;
}

export interface IPaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
}
