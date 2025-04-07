export const getIdFromUrl = (url) => {
  const parts = url.split("/");

  // Get the last part (ID)
  const id = parts[parts.length - 1].substring(1);
  return id;
};
