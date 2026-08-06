export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  pages?: number;
  [key: string]: unknown;
}

export interface ApiResponseBody<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: ApiMeta;
  errors?: unknown[];
}
