import React from "react";
import InfiniteScroll from "../website/yourExperiences";
import Title from "../components/Title";

export default function infiniteScroll()  {
  return (
    <div>
            <Title title="Your Experiences" />

      <InfiniteScroll />
    </div>
  );
};
