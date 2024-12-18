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
