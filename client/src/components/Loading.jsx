import { LoaderCircle } from "lucide-react";
import "../styles/Loading.css";

export const Loading = () => {
  return (
    <div className="loading">
      <LoaderCircle className="loading-icon" />
      <p>Loading...</p>
    </div>
  );
};
