import Title from "../components/Title";
import Home from "./HomePage";

export default function home({ data }) {
  console.log(data);
  return (
    <div>
      <Title title="Home" />
      <Home />
    </div>
  );
};
