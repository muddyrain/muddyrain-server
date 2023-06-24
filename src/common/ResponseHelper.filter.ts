export interface ResponseReturn {
  code: number;
  data: any;
  message: string;
}
export class ResponseHelper {
  /**
   * 响应一个错误数据
   * @param data 返回数据
   * @param code 状态码
   * @param message 消息
   * @returns {ResponseReturn} 响应信息
   */
  public static error(message: string, code = 500): ResponseReturn {
    return {
      code,
      data: null,
      message,
    };
  }

  /**
   * 响应一个成功数据
   * @param data 返回数据
   * @param code 状态码
   * @param message 消息
   * @returns {ResponseReturn} 响应信息
   */
  public static success(
    data: any,
    code = 200,
    message = 'success',
  ): ResponseReturn {
    return {
      code,
      data,
      message,
    };
  }
}
