export const fetchCategory = async () => {
  const DOMAIN = import.meta.env.VITE_API_URL;
  try {
    const response = await fetch(
      `${DOMAIN}/raiden/v2/menu-config?platform=desktop`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(error);
  }
};
