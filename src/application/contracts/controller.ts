import { HttpResponse } from "../helpers/http-request";

export abstract class Controller {
  abstract exec<T=any>(HttpRequest: any): Promise<HttpResponse<T>>;

  protected sendError(error: any): HttpResponse<{ message: string }> {
    return {
      status: error.code ? error.code : 500,
      data: error.message,
    };
  }

  protected sendSucess(status: 200 | 204, data: any): HttpResponse<any> {
    return {
      status: status || 200,
      data: { ok : 1, ...data} || null,
    };
  }
}
