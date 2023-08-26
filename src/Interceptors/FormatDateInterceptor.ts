import { DATE_FORMATE_TYPE } from '@/constant';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { isObject } from 'util';
import * as dayjs from 'dayjs';

@Injectable()
export class FormatDateInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          return {
            ...res,
            data: data.map((item) => this.formatItem(item)),
          };
        } else if (isObject(data)) {
          return {
            ...res,
            data: this.formatItem(data),
          };
        }
        return res;
      }),
    );
  }

  private formatItem(item: any): any {
    if (item.createTime instanceof Date) {
      item.formatted_create_time = dayjs(item.create_time).format(
        DATE_FORMATE_TYPE,
      );
    }
    if (item.updateTime instanceof Date) {
      item.formatted_update_time = dayjs(item.update_time).format(
        DATE_FORMATE_TYPE,
      );
    }
    return item;
  }
}
