export const getUrlKey = (url) => {
  const parts = url.split("/");
  // Get the last part (ID)
  const id = parts[parts.length - 2];
  console.log(id);
  return id;
};
