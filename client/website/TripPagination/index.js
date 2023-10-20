import React, { useState } from "react";
import { Pagination } from "react-bootstrap";
import PlaceCardFull from "../components/PlaceCardFull";

const allTrips = [
  {
    id: "1",
    event: "Event",
    name: "Football Match LA FC vs NYC FC ",
    country: "New York, USA",
    bgImg:
      "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=394&q=80",
  },
  {
    id: "2",
    event: "Event",
    name: "Football Match LA FC vs NYC FC ",
    country: "New York, USA",
    bgImg:
      "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=394&q=80",
  },
  {
    id: "3",
    event: "Event",
    name: "Football Match LA FC vs NYC FC ",
    country: "New York, USA",
    bgImg:
      "https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=394&q=80",
  },
  {
    id: "4",
    event: "Event",
    name: "Football Match LA FC vs NYC FC ",
    country: "New York, USA",
    bgImg:
      "https://images.unsplash.com/photo-1543261207-e5f1837778c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=773&q=80",
  },
  {
    id: "5",
    event: "Event",
    name: "Football Match LA FC vs NYC FC ",
    country: "New York, USA",
    bgImg:
      "https://images.unsplash.com/photo-1543261207-e5f1837778c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=773&q=80",
  },
  {
    id: "6",
    event: "Event",
    name: "Football Match LA FC vs NYC FC ",
    country: "New York, Pakistan",
    bgImg:
      "https://images.unsplash.com/photo-1543261207-e5f1837778c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=773&q=80",
  },
  {
    id: "7",
    event: "Event",
    name: "Football Match LA FC vs NYC FC ",
    country: "New York, Pakistan",
    bgImg:
      "https://images.unsplash.com/photo-1543261207-e5f1837778c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=773&q=80",
  },
  {
    id: "8",
    event: "Event",
    name: "Football Match LA FC vs NYC FC ",
    country: "New York, Pakistan",
    bgImg:
      "https://images.unsplash.com/photo-1543261207-e5f1837778c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=773&q=80",
  },
];
export default () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalItems = allTrips.length;
  const itemsPerPage = 4;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allTrips.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div className="container px-5 pt-3 pb-5">
        <div className="row d-flex w-100">
          <h1 className="dark bold text-center">New York</h1>
          <p className="text-center mb-3 fw-500 pb-3 px-lg-5">
            Discover the world's top destinations and plan your next adventure
            with ease using <br /> Onroot's curated posts and itineraries
          </p>

          <div className="row p-0 m-0">
            {currentItems.map((item, index) => {
              return (
                <div className="col-lg-6 p-0 m-0">
                  <PlaceCardFull
                    key={index}
                    imageUrl={item.bgImg}
                    itinerary={item.event}
                    title={item.name}
                    place={item.country}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <Pagination className="mt-4">
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            />
            <Pagination.Item active>{currentPage}</Pagination.Item>
            <Pagination.Next
              disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
              onClick={() => setCurrentPage(currentPage + 1)}
            />
          </Pagination>
        </div>
      </div>
    </div>
  );
};
