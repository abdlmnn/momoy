import { jwtDecode } from 'jwt-decode';

export const isExpired = (token: string) => {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch (e) {
    return true;
  }
};
