// import React from "react";
// import styles from "../styles/styles";

// const SortOptions = ({ sortBy, sortRating,sortPrice, handleSortChange }) => {
//   return (
//     <div>
//       {/* Sort By Dropdown */}
//       <div className="flex items-center mb-3">
//         <label className="mr-3">Sort By:</label>
//         <select
//           className="p-2 border border-gray-300 rounded-md"
//           value={sortBy}
//           onChange={(e) => handleSortChange(e.target.value, sortRating, sortPrice)}
//         >
//           <option value="createdAt">Latest</option>
//           <option value="a">Price (Low to High)</option>
//           <option value="h">Price (High to Low)</option>

//           {/* Add more sort options as needed */}
//         </select>
//       </div>

//       {/* Sort Order Dropdown */}
//       <div className="flex items-center">
//         <label className="mr-3">Customer Rating:</label>
//         <select
//           className="p-2 border border-gray-300 rounded-md"
//           value={sortRating}
//           onChange={(e) => handleSortChange(sortBy, e.target.value, sortPrice)}
//           >  
//           <option value="default">Select</option>
//           <option value="1">4 and above</option>
//           <option value="2">3-4</option>
//           <option value="3">2-3</option>
//           <option value="4">1-2</option>
//         </select>
//       </div>


//       <div className="flex items-center">
//         <label className="mr-3">Price</label>
//         <select
//           className="p-2 border border-gray-300 rounded-md"
//           value={sortPrice}
//           onChange={(e) => handleSortChange(sortBy, sortRating, e.target.value)}
//         >
//           <option value="default">Select</option>
//           <option value="a">0-199</option>
//           <option value="b">200-499</option>
//           <option value="c">500-999</option>
//           <option value="d">1000-1499</option>
//           <option value="e">1500-1999</option>
//           <option value="f">2000-2999</option>
//           <option value="g">3000-4999</option>
//           <option value="h">5000 and above</option>
//         </select>
//       </div>
//     </div>
//   );
// };

// export default SortOptions;