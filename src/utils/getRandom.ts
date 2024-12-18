export const getRandomId = async (code?: number) => {
  let min = 0;
  let max = code || 500000;
  min = Math.ceil(min);
  max = Math.floor(max);
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  const result = `${num.toString().padStart(6, '0')}`;

  return result;
};
