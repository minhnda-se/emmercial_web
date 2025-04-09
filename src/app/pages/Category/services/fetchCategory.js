export const fetchCategory = async (id) => {
  const URL = import.meta.env.VITE_TIKI_URL;
  try {
    const response = await fetch(
      `${URL}/api/v2/categories?include=children&parent_id=${id}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(error);
  }
};
