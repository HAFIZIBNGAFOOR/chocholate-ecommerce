import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const getCurrentJST = (format?: string) => {
  return dayjs().tz('Asia/Tokyo').format(!format ? 'YYYY-MM-DD HH:mm:ss': format);
};



export const getAddToCurrentJST = (num: number, unit: dayjs.ManipulateType) => {
  return dayjs().tz('Asia/Tokyo').add(num, unit).format('YYYY-MM-DD HH:mm:ss');
};

export const isAfterCurrentJST = (time: string) => {
  console.log('current passed time', dayjs(time).tz('Asia/Tokyo'));
  console.log('current JST', dayjs().tz('Asia/Tokyo'));
  console.log('is passed time after JST?', dayjs(time).tz('Asia/Tokyo').isAfter(dayjs().tz('Asia/Tokyo')));
  return dayjs(time).tz('Asia/Tokyo').isAfter(dayjs().tz('Asia/Tokyo'));
};
