export const fetchSearchProduct = async (searchValue, query, page) => {
  const DOMAIN = import.meta.env.VITE_TIKI_URL;
  try {
    const response = await fetch(
      `${DOMAIN}/api/v2/products?limit=40&include=advertisement&aggregations=2&q=${searchValue}${query}&page=${page}`
    );
    console.log(
      `${DOMAIN}/api/v2/products?limit=40&include=advertisement&aggregations=2&q=${searchValue}${query}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const services = [];
    const code = new Map([
      ["category", {}],
      ["rating", {}],
      ["price", {}],
      ["brand", {}],
    ]);
    data.filters.forEach((item) => {
      if (code.has(item.code)) {
        code.set(item.code, item);
      } else if (item.type === "service") {
        services.push(item);
      }
    });
    return {
      data: data.data,
      paging: data.paging,
      widgets: data.widgets,
      sort: data.sort_options,
      filters: {
        services: services,
        rating: code.get("rating"),
        price: code.get("price"),
        category: code.get("category"),
        brand: code.get("brand"),
        data: data.filters,
      },
      query_info: data.query_info,
    };
  } catch (error) {
    throw new Error(error);
  }
};
