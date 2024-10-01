export const isValidPhone = (phone: string) =>
  /^(?:\+84|84|0)(3|5|7|8|9|1[2689])[0-9]{8}$/.test(phone);
