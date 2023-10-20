// import React from 'react'

// export default () => {
//     const [saveTrips, setSaveTrips] = useState([]);

//     const getSaveTrips = async () => {
//       try {
//         const response = await axios.get("http://localhost:8000/api/savetrip");
//         console.log(response.data); // Log the entire response data
//         const data = response.data.tripsPosts;
//         setSaveTrips(data);
//       } catch (error) {
//         console.error("Error fetching saved trips:", error);
//       }
//     };
// useEffect(() => {
//     getSaveTrips();
//   }, []);

  // const deleteSavedTrip = async (tripId) => {
  //   try {
  //     const response = await axios.delete(
  //       `http://localhost:8000/api/savepost/${tripId}`
  //     );

  //     // Handle success and update the UI
  //     console.log(response.data);
  //     getSaveTrips();
  //   } catch (error) {
  //     console.error("Error deleting saved trip:", error);
  //   }
  // };
//   return (
//     <div> <div className="row px-4">
//     {saveTrips.length === 0 || trips.length === 0 ? (
//       "Loading..."
//     ) : (
//       <div className="col-lg-12">
//         <h1 className="dark bold fw-700 pt-4 text-center mb-4">
//           Your Save Trips
//         </h1>
//         <InfiniteScroll
//           className="w-100 overflow-hidden"
//           dataLength={trips.length}
//           loader={<h4>Loading...</h4>}
//         >
//           <Box sx={{ minHeight: 829 }}>
//             <Masonry columns={3} spacing={2}>
//               {saveTrips.map((savedTrip) => {
//                 const matchingTrip = trips.find(
//                   (trip) => trip._id === savedTrip.tripId
//                 );

//                 if (matchingTrip) {
//                   return (
//                     <div key={savedTrip._id}>
//                       <div
//                         className="position-relative"
//                         key={matchingTrip._id}
//                       >
//                         <button
//                           className="bg-danger border-0 rounded-2 position-absolute z-3 px-3 fw-700"
//                           style={{ right: "0px" }}
//                           onClick={() => deleteSavedTrip(savedTrip.tripId)}
//                         >
//                           x
//                         </button>
//                       </div>
//                       <Link href={`/trip/${matchingTrip._id}`}>
//                         <img
//                           src={matchingTrip.image}
//                           alt="tripImg"
//                           className={styles.placeImg}
//                           loading="lazy"
//                           style={{
//                             display: "block",
//                             width: "100%",
//                             borderRadius: "15px",
//                             opacity: "0.99990000999",
//                           }}
//                         />
//                       </Link>

//                       <div className="d-flex justify-content-between mt-2">
//                         <h4 className="w-700 mb-0 text-dark">
//                           Title: {matchingTrip.title}
//                         </h4>
//                         <button
//                           className="bg-success text-light border-0 rounded-2 px-2 mx-2"
//                           onClick={() => updateTripEditHandle(matchingTrip)}
//                         >
//                           Edit Trip
//                         </button>
//                       </div>
//                       <div className="d-flex justify-content-between mt-2">
//                         <h4 className="w-700 mb-0 text-dark">
//                           region: {matchingTrip.region}
//                         </h4>{" "}
//                         <br />
//                         <h4 className="w-700 mb-0 text-dark">
//                           Start Date: {matchingTrip.sdate}
//                         </h4>
//                         <h4 className="w-700 mb-0 text-dark">
//                           End Date: {matchingTrip.edate}
//                         </h4>
//                       </div>
//                     </div>
//                   );
//                 } else {
//                   return (
//                     <p key={savedTrip._id}>
//                       No matching trip details found for Trip ID:{" "}
//                       {savedTrip.tripId}
//                     </p>
//                   );
//                 }
//               })}
//             </Masonry>
//           </Box>
//         </InfiniteScroll>
//       </div>
//     )}
//   </div></div>
//   )
// }
