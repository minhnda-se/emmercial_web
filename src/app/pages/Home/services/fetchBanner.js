export const fetchBanner = async () => {
  const URL = import.meta.env.VITE_BANNER_URL;
  try {
    const response = await fetch(`${URL}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(error);
  }
};
