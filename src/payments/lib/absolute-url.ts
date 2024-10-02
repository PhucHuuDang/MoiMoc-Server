export const absoluteUrl = (url: string) => {
  return `${process.env.DOMAIN}${url}`;
};
