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
        const _data = res.data;
        const _data2 = res.data?.data;
        if (Array.isArray(_data)) {
          return {
            ...res,
            data: _data.map((item) => this.formatItem(item)),
          };
        }
        if (Array.isArray(_data2)) {
          return {
            ...res,
            data: {
              ..._data,
              data: _data2.map((item) => this.formatItem(item)),
            },
          };
        } else if (isObject(_data)) {
          return {
            ...res,
            data: this.formatItem(_data),
          };
        }
        return res;
      }),
    );
  }

  private formatItem(item: any): any {
    if (item.createTime instanceof Date) {
      item.formatted_create_time = dayjs(item.createTime).format(
        DATE_FORMATE_TYPE,
      );
    }
    if (item.updateTime instanceof Date) {
      item.formatted_update_time = dayjs(item.updateTime).format(
        DATE_FORMATE_TYPE,
      );
    }
    return item;
  }
}
