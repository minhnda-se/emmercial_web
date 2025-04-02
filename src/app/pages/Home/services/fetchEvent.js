export const fetchEvent = async () => {
  const DOMAIN = import.meta.env.VITE_API_URL;
  try {
    const response = await fetch(
      "https://tka.tiki.vn/widget/api/v1/banners-group?group=commercial_banner_on_home&platform=web&banner_version=2.7&_rf=rotate_by_ctr&trackity_id=3c2d2eaa-ec0e-527a-3444-2c04e0050144&_rf=rotate_by_ctr"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    throw new Error(error);
  }
};
