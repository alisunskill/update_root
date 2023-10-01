import Title from "../components/Title";
import Home from "./HomePage";

export default ({ data }) => {
  console.log(data);
  return (
    <div>
      <Title title="Home" />
      <Home />
    </div>
  );
};
