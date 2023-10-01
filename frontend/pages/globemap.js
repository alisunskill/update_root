import React from "react";
import Globe from "../components/Globe";
import { useSelector } from "react-redux";

export default () => {
  const recommendationsData = useSelector((state) => state.recommendation);

  return (
    <div>
      <Globe data={recommendationsData} />
    </div>
  );
};
