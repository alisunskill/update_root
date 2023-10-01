import React from "react";
import DestinationPage from "../../website/InfiniteScroll/[DestinationPage]";

export default (params) => {
  console.log(params, "params");
  return (
    <div>
      <DestinationPage params={params} />
    </div>
  );
};

export async function getServerSideProps({ params }) {
  console.log(params);
  return {
    props: {
      ...params,
    },
  };
}
