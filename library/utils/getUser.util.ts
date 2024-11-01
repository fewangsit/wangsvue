import { User } from 'lib/types/user.type';

const getUser = (): Partial<User> =>
  (JSON.parse(localStorage.getItem('user') as string) as User) ?? {};

export default getUser;
