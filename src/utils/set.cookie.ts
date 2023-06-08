import { Response } from 'express';

const setCookie = (res: Response, token: string) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 4);

  res.cookie('lixu-ig-clone', token, {
    expires: expiryDate,
    httpOnly: true,
  });
};

export default setCookie;
