import { v4 as uuidv4 } from 'uuid';
import RandomString from 'randomstring';

export const generatedId = () => uuidv4();

export const generatePassword = (RegExp: RegExp) => {
  let password;

  do {
    password = RandomString.generate({
      length: 6,
      charset: 'alphanumeric',
    });
  } while (!RegExp.test(password));

  return password;
};

export const randomNumber = (
  length: number = 6,
  charset: 'alphanumeric' | 'alphabetic' | 'numeric' | 'hex' | 'binary' | 'octal',
) => {
  let number;
  do {
    number = RandomString.generate({
      length: length,
      charset: charset,
    });
  } while (number.length !== length || number.length < length || number[0] === '0');
  console.log(length);
  console.log(number.length);
  console.log(number);
  return number;
};