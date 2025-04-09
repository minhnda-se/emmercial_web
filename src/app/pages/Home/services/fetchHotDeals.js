export const fetchHotDeals = async () => {
  const DOMAIN = import.meta.env.VITE_API_URL;
  try {
    const response = await fetch(
      `${DOMAIN}/raiden/v3/widgets/quick_link_v2?trackity_id=3c2d2eaa-ec0e-527a-3444-2c04e0050144&_rf=rotate_by_ctr#`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(error);
  }
};
