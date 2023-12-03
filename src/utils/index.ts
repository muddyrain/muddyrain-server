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

export function truncateString(str: string, maxLength: number) {
  if (str.length <= maxLength) {
    return str;
  }

  let truncated = str.substring(0, maxLength);

  // 检查截取部分的最后一个字符是否是空格
  if (truncated[truncated.length - 1] === ' ') {
    return truncated;
  }

  // 如果不是空格，则找到最后一个空格的位置，并在此处截断字符串
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  if (lastSpaceIndex !== -1) {
    truncated = truncated.substring(0, lastSpaceIndex);
  }

  return truncated;
}
