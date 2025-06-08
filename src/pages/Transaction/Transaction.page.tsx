import { useParams } from "react-router-dom";

import TransactionDetails from "../../components/common/TransactionDetails/TransactionDetails.component";

const TransactionPage = () => {
  const { id } = useParams();
  return <TransactionDetails id={id ?? ""} />;
};

export default TransactionPage;
