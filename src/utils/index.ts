import * as dayjs from 'dayjs';

export const getCurrentTime = (formate = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs().format(formate);
};

export const formateTime = (
  time: string | number | dayjs.Dayjs | Date,
  formate = 'YYYY-MM-DD HH:mm:ss',
) => {
  return dayjs(time).format(formate);
};
