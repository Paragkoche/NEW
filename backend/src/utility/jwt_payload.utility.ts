export const makeJWtToken = (id: number, username: string) => {
  return btoa(`${id}::${username}::${new Date()}`);
};
export const deCodeJwtToken = (token: string) => {
  const str = atob(token);
  const [id, username, time] = str.split('::');
  return {
    id,
    username,
    time,
  };
};
