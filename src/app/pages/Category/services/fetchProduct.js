export const fetchProduct = async (urlKey, id) => {
  const URL = import.meta.env.VITE_TIKI_URL;
  try {
    const response = await fetch(
      `${URL}/api/personalish/v1/blocks/listings?limit=10&sort=top_seller&page=1&urlKey=${urlKey}&category=${id}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
