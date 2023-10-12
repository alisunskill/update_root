import React, { useState, useEffect } from "react";

const data = [
  { name: "Alice", age: 25, address: "123 Main St" },
  { name: "Bob", age: 30, address: "456 Elm St" },
  { name: "nnn", age: 30, address: "456 Elm St" },
  { name: "zcxzc", age: 30, address: "456 Elm St" },
  { name: "bnbnb", age: 30, address: "456 Elm St" },
  { name: "llokl", age: 30, address: "456 Elm St" },
  { name: "bnbnb", age: 30, address: "456 Elm St" },
  { name: "nbnbwewe", age: 30, address: "456 Elm St" },
  { name: "uyuyi", age: 30, address: "456 Elm St" },
  { name: "Bomnmnmb", age: 30, address: "456 Elm St" },
  { name: "nbyii", age: 30, address: "456 Elm St" },
  { name: "Bob", age: 30, address: "456 Elm St" },
];

function Test() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim() === "") {
        setSuggestions([]); 
      } else {
        const filteredData = data.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSuggestions(filteredData);
      }
    }, 300); 

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div>
      <h1>Sunny Results</h1>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div id="results">
        {suggestions.map((item, index) => (
          <p key={index} value={item.name}>
            {item.name}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Test;
