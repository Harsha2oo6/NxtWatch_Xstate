import Cookies from "js-cookie";

export const FetchDetails = async (url: string) => {
  const jwt = Cookies.get("jwt_token");
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  };
  const fetchedData = await fetch(url, options);

  if (fetchedData.ok) {
    const response = await fetchedData.json();
    return response;
  } else {
    const error = await fetchedData.json();
    throw error;
  }
};
