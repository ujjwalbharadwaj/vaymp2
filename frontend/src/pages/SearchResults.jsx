import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import Loader from "../components/Layout/Loader";
import styles from "../styles/styles";
import axios from "axios";
import { server } from "../server";
import { categoriesData, sleeveType, neckType, color, fabric, occasion, fit, gender, size, subCategory, brandingData } from "../static/data"; // Assuming data is imported correctly

const SearchResults = () => {
  const { query } = useParams();
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    colors: [],
    sizes: [],
    brandingDatas: [],
    neckTypes: [],
    sleeveTypes: [],
    fabrics: [],
    occasions: [],
    fits: [],
    subCategorys: [],
    genders: [],
    customerRatings: [],
    priceRanges: [],
  });
  const [sortBy, setSortBy] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${server}/product/get-all-searched-products`, {
        params: {
          query,
          page: currentPage,
          limit: 6,
          color: filters.colors.join(","),
          neckType: filters.neckTypes.join(","),
          sleeveType: filters.sleeveTypes.join(","),
          size: filters.sizes.join(","),
          fit: filters.fits.join(","),
          gender: filters.genders.join(","),
          occasion: filters.occasions.join(","),
          subCategory: filters.subCategorys.join(","),
          fabric: filters.fabrics.join(","),
          brandingData: filters.brandingDatas.join(","),
          customerRating: filters.customerRatings.join(","),
          priceRange: filters.priceRanges.join(","),
          sortBy
        },
      });

      const data = response.data;
      console.log("data", data.products);
      if (data.success) {
        setFilteredData(data.products);
        setTotalPages(data.totalPages);
      } else {
        setError("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [query, currentPage, filters, sortBy]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCheckboxChange = (type, value) => {
    const newFilters = { ...filters };
    if (newFilters[type].includes(value)) {
      newFilters[type] = newFilters[type].filter((item) => item !== value);
    } else {
      newFilters[type].push(value);
    }
    setFilters(newFilters);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div>
          <Header activeHeading={3} />
          <div className={`${styles.section}`}>
            {/* Filter Form */}
            <form onSubmit={handleFilterSubmit} className="mb-4">
              <div className="flex space-x-4 flex-wrap">
                {/* Color Filter */}
                <div className="dropdown">
                  <button className="p-2 border bg-white" type="button">
                    Color
                  </button>
                  <ul className="dropdown-menu">
                    {color.map((c) => (
                      <li key={c.id}>
                        <label>
                          <input
                            type="checkbox"
                            value={c.name}
                            checked={filters.colors.includes(c.name)}
                            onChange={() => handleCheckboxChange("colors", c.name)}
                          />
                          {c.name}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Size Filter */}
                <div className="dropdown">
                  <button className="p-2 border bg-white" type="button">
                    Size
                  </button>
                  <ul className="dropdown-menu">
                    {size.map((s) => (
                      <li key={s.id}>
                        <label>
                          <input
                            type="checkbox"
                            value={s.type}
                            checked={filters.sizes.includes(s.type)}
                            onChange={() => handleCheckboxChange("sizes", s.type)}
                          />
                          {s.type}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* SubCategory Filter */}
                <div className="dropdown">
                  <button className="p-2 border bg-white" type="button">
                    SubCategory
                  </button>
                  <ul className="dropdown-menu">
                    {subCategory.map((s) => (
                      <li key={s.id}>
                        <label>
                          <input
                            type="checkbox"
                            value={s.title}
                            checked={filters.subCategorys.includes(s.title)}
                            onChange={() => handleCheckboxChange("subCategorys", s.title)}
                          />
                          {s.title}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Neck Type Filter */}
                <div className="dropdown">
                  <button className="p-2 border bg-white" type="button">
                    Neck Type
                  </button>
                  <ul className="dropdown-menu">
                    {neckType.map((s) => (
                      <li key={s.id}>
                        <label>
                          <input
                            type="checkbox"
                            value={s.title}
                            checked={filters.neckTypes.includes(s.title)}
                            onChange={() => handleCheckboxChange("neckTypes", s.title)}
                          />
                          {s.title}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Fabric Filter */}
                <div className="dropdown">
                  <button className="p-2 border bg-white" type="button">
                    Fabric
                  </button>
                  <ul className="dropdown-menu">
                    {fabric.map((s) => (
                      <li key={s.id}>
                        <label>
                          <input
                            type="checkbox"
                            value={s.type}
                            checked={filters.fabrics.includes(s.type)}
                            onChange={() => handleCheckboxChange("fabrics", s.type)}
                          />
                          {s.type}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Occasion Filter */}
                <div className="dropdown">
                  <button className="p-2 border bg-white" type="button">
                    Occasion
                  </button>
                  <ul className="dropdown-menu">
                    {occasion.map((s) => (
                      <li key={s.id}>
                        <label>
                          <input
                            type="checkbox"
                            value={s.type}
                            checked={filters.occasions.includes(s.type)}
                            onChange={() => handleCheckboxChange("occasions", s.type)}
                          />
                          {s.type}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Fit Filter */}
                <div className="dropdown">
                  <button className="p-2 border bg-white" type="button">
                    Fit
                  </button>
                  <ul className="dropdown-menu">
                    {fit.map((s) => (
                      <li key={s.id}>
                        <label>
                          <input
                            type="checkbox"
                            value={s.type}
                            checked={filters.fits.includes(s.type)}
                            onChange={() => handleCheckboxChange("fits", s.type)}
                          />
                          {s.type}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Sleeve Type Filter */}
                <div className="dropdown">
                  <button className="p-2 border bg-white" type="button">
                    Sleeve Type
                  </button>
                  <ul className="dropdown-menu">
                    {sleeveType.map((s) => (
                      <li key={s.id}>
                        <label>
                          <input
                            type="checkbox"
                            value={s.title}
                            checked={filters.sleeveTypes.includes(s.title)}
                            onChange={() => handleCheckboxChange("sleeveTypes", s.title)}
                          />
                          {s.title}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Gender Filter */}
                <div className="dropdown">
                  <button className="p-2 border bg-white" type="button">
                    Gender
                  </button>
                  <ul className="dropdown-menu">
                    {gender.map((s) => (
                      <li key={s.id}>
                        <label>
                          <input
                            type="checkbox"
                            value={s.type}
                            checked={filters.genders.includes(s.type)}
                            onChange={() => handleCheckboxChange("genders", s.type)}
                          />
                          {s.type}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Branding Data Filter */}
                <div className="dropdown">
                  <button className="p-2 border bg-white" type="button">
                    Branding Data
                  </button>
                  <ul className="dropdown-menu">
                    {brandingData.map((b) => (
                      <li key={b.id}>
                        <label>
                          <input
                            type="checkbox"
                            value={b.title}
                            checked={filters.brandingDatas.includes(b.title)}
                            onChange={() => handleCheckboxChange("brandingDatas", b.title)}
                          />
                          {b.title}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Customer Rating Filter */}
                <div className="dropdown">
                  <button className="p-2 border bg-white" type="button">
                    Customer Rating
                  </button>
                  <ul className="dropdown-menu">
                    {[
                      { label: "3 and below", value: "3-and-below" },
                      { label: "3 to 4", value: "3-to-4" },
                      { label: "4 and above", value: "4-and-above" },
                    ].map((rating) => (
                      <li key={rating.value}>
                        <label>
                          <input
                            type="checkbox"
                            value={rating.value}
                            checked={filters.customerRatings.includes(rating.value)}
                            onChange={() => handleCheckboxChange("customerRatings", rating.value)}
                          />
                          {rating.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price Range Filter */}
                <div className="dropdown">
                  <button className="p-2 border bg-white" type="button">
                    Price Range
                  </button>
                  <ul className="dropdown-menu">
                    {["0-50", "51-100", "101-200", "1501-1700", "700-1500"].map((range) => (
                      <li key={range}>
                        <label>
                          <input
                            type="checkbox"
                            value={range}
                            checked={filters.priceRanges.includes(range)}
                            onChange={() => handleCheckboxChange("priceRanges", range)}
                          />
                          {`$${range.split('-')[0]} - $${range.split('-')[1]}`}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Sort By */}
                <div className="dropdown">
                  <select className="p-2 border bg-white" onChange={handleSortChange} value={sortBy}>
                    <option value="">Sort By</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating-asc">Rating: Low to High</option>
                    <option value="rating-desc">Rating: High to Low</option>
                    <option value="date-asc">Date: Old to New</option>
                    <option value="date-desc">Date: New to Old</option>
                  </select>
                </div>
                <button type="submit" className="p-2 bg-blue-500 text-white">
                  Apply Filters
                </button>
              </div>
            </form>

            {/* Render product cards based on filtered data */}
            <div className="pt-2 hidden md:block">
              <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
                {filteredData.map((product, index) => (
                  <ProductCard data={product} key={index} />
                ))}
              </div>
              {filteredData.length === 0 && (
                <h1 className="text-center w-full pb-[100px] text-[20px]">
                  No products found!
                </h1>
              )}
            </div>
            {/* Additional rendering for smaller screens */}
            <div className="pt-2 md:hidden">
              <div className="grid grid-cols-2 gap-[25px] md:grid-cols-2 md:gap-[25px] mb-12">
                {filteredData.map((product, index) => (
                  <ProductCard data={product} key={index} />
                ))}
              </div>
              {filteredData.length === 0 && (
                <h1 className="text-center w-full pb-[100px] text-[20px]">
                  No products found!
                </h1>
              )}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
              {[...Array(totalPages).keys()].map((page) => (
                <button
                  key={page + 1}
                  className={`px-4 py-2 mx-1 ${
                    currentPage === page + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handlePageChange(page + 1)}
                >
                  {page + 1}
                </button>
              ))}
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default SearchResults;
