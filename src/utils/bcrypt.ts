import bcrypt from 'bcrypt';

const saltRounds = 10;

export const compPassword = async (password: string, hashedPassword: string) =>
  await bcrypt.compare(password, hashedPassword);

export const hashPassword = (password: string) => bcrypt.hashSync(password, saltRounds);
