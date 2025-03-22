export class ResponseHelper {
  static success(message: string, data: any = undefined, statusCode = 200) {
    const response: {
      success: boolean;
      message: string;
      statusCode: number;
      data?: any;
    } = {
      success: true,
      message,
      statusCode,
    };

    if (data !== undefined) response.data = data;
    return response;
  }

  static error(message: string, statusCode = 400, error: any = undefined) {
    const response: {
      success: boolean;
      message: string;
      statusCode: number;
      error?: any;
    } = {
      success: false,
      message,
      statusCode,
    };

    if (error !== undefined) response.error = error;

    return response;
  }
}
