import { useLoginMachine } from "../../Components/LoginMachineWrapper";


export const FetchDetails = async (url: string) => {
  const {loginState}=useLoginMachine()
  const options = {
  method: "GET",
  headers: {
    Authorization: `Bearer ${loginState.context.token}`,
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
