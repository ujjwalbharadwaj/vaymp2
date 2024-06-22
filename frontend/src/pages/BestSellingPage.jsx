import React, { useEffect, useState, useRef } from "react";
import { useSelector,useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import styles from "../styles/styles";
import Footer from "../components/Layout/Footer";
import { getAllProducts } from "../redux/actions/product";
import { categoriesData, sleeveType, neckType, color, fabric, occasion, fit, gender, size } from "../static/data"; // Assuming data is imported correctly
import { AiOutlineCaretDown, AiOutlineCaretUp } from "react-icons/ai";
const BestSellingPage = () => {
  const [data, setData] = useState([]);
  const [searchParams] = useSearchParams();
  const categoriesParam = searchParams.get("category");
  const {allProducts,isLoading} = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    category: categoriesParam ? categoriesParam.split(',') : [],
    color: [],
    size: [],
    neckType: [],
    sleeveType: [],
    gender: [],
    fabric: [],
    fit: [],
    occasion: [],
    sortBy: "",
    sortOrder: "desc",
    customerRating: [],
    priceRange: [],
  });

  const [categoryExpanded, setCategoryExpanded] = useState(false);
  const [sizeExpanded, setSizeExpanded] = useState(false);
  const [colorExpanded, setColorExpanded] = useState(false);
  const [fabricExpanded, setFabricExpanded] = useState(false);
  const [occasionExpanded, setOccasionExpanded] = useState(false);
  const [fitExpanded, setFitExpanded] = useState(false);
  const [genderExpanded, setGenderExpanded] = useState(false);
  const [sleeveTypeExpanded, setSleeveTypeExpanded] = useState(false);
  const [neckTypeExpanded, setNeckTypeExpanded] = useState(false);
  const [customerRatingExpanded, setCustomerRatingExpanded] = useState(false);
  const [priceRangeExpanded, setPriceRangeExpanded] = useState(false);
  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a,b) => b.sold_out - a.sold_out); 
    setData(sortedData);
  }, [allProducts]);
  useEffect(() => {
    if (categoriesParam === null) {
      setData(allProducts);
    } else {
      const filteredData = allProducts.filter((item) => filters.category.includes(item.category));
      setData(filteredData);
    }
  }, [allProducts, categoriesParam, filters.category]);

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters };
    // Logic for updating filters remains the same
    if (
      key === "size" ||
      key === "sleeveType" ||
      key === "neckType" ||
      key === "fabric" ||
      key === "fit" ||
      key === "gender" ||
      key === "occasion" ||
      key === "color"
    ) {
      const index = updatedFilters[key].indexOf(value);
      if (index === -1) {
        updatedFilters[key].push(value);
      } else {
        updatedFilters[key].splice(index, 1);
      }
    } else if (key === "priceRange" || key === "customerRating") {
      const index = updatedFilters[key].indexOf(value);
      if (index === -1) {
        updatedFilters[key].push(value);
      } else {
        updatedFilters[key].splice(index, 1);
      }
    } else if (key === "category") {
      const index = updatedFilters[key].indexOf(value);
      if (index === -1) {
        updatedFilters[key].push(value);
      } else {
        updatedFilters[key].splice(index, 1);
      }
    } else {
      updatedFilters[key] = value;
    }
    setFilters(updatedFilters);
  };

  const applyFilters = () => {
    // Dispatch action to get filtered products
    let categoryParam = "";
    if (Array.isArray(filters.category)) {
      categoryParam = filters.category.join(','); // Convert array to comma-separated string
    } else if (typeof filters.category === "string") {
      categoryParam = filters.category;
    }
    const queryParams = {
      category: categoryParam,
      color: filters.color,
      size: filters.size,
      neckType: filters.neckType,
      sleeveType: filters.sleeveType,
      fabric: filters.fabric,
      occasion: filters.occasion,
      fit: filters.fit,
      gender: filters.gender,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      customerRating: filters.customerRating,
      priceRange: filters.priceRange,
    };
    dispatch(getAllProducts(queryParams));
  };

  const [FilterisOpen, setFilterIsOpen] = useState(false);
  const [SortisOpen, setSortIsOpen] = useState(false);
  const filterRef = useRef(null);
  const sortRef = useRef(null);
  useEffect(() => {
    applyFilters();
  }, [filters]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterIsOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortIsOpen(false);
      }
    };

    if (FilterisOpen || SortisOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [FilterisOpen, SortisOpen]);
  return (
    <>
    {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={2} />
          <div className="flex mb-2 sticky top-28 z-10" style={{ zIndex: 1 }}>
          <div className="w-1/2 relative" ref={filterRef}>
              <div>
                <button onClick={() => setFilterIsOpen((prev) => !prev)} className="w-full bg-yellow-400 p-1 mt-1 flex items-left justify-between font-bold text-lg rounded-2xl tracking-wider border-4 border-transparent active:border-blue-100 duration-300 active:text-blue-500">
                  Filter By
                  {!FilterisOpen ? (
                    <AiOutlineCaretDown className="h-8" />
                  ) : (
                    <AiOutlineCaretUp className="h-8" />
                  )}
                </button>

                {FilterisOpen && (
                  <div className="bg-amber-100 absolute w-full z-20">
                    <div className={`${styles.filterContainer}`}>
                      {/* Size filter section */}
                      <div>
                        <label className="mb-0 cursor-pointer flex items-left justify-between bg-amber-200 border" onClick={() => setSizeExpanded(!sizeExpanded)}>
                          Size
                          {!sizeExpanded ? (
                            <AiOutlineCaretDown className="h-8" />
                          ) : (
                            <AiOutlineCaretUp className="h-8" />
                          )}
                        </label>
                        {sizeExpanded && (
                          <>
                            {size.map((option, index) => (
                              <div key={index} className="flex items-center mb-2">
                                <input
                                  type="checkbox"
                                  id={option.id}
                                  name="size"
                                  value={option.type}
                                  onChange={(e) => {
                                    handleFilterChange("size", e.target.value);
                                    applyFilters();
                                  }}
                                  checked={filters.size.includes(option.type)}
                                />
                                <label htmlFor={option.id} className="ml-2">{option.type}</label>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                      {/* Color filter section */}
                      <div>
                        <label className="mb-0 cursor-pointer flex items-left justify-between bg-amber-200" onClick={() => setColorExpanded(!colorExpanded)}>
                          Color
                          {!colorExpanded ? (
                            <AiOutlineCaretDown className="h-8" />
                          ) : (
                            <AiOutlineCaretUp className="h-8" />
                          )}
                        </label>
                        {colorExpanded && (
                          <>
                            {color.map((option) => (
                              <div key={option.id} className="flex items-center mb-2">
                                <input
                                  type="checkbox"
                                  id={option.id}
                                  name="color"
                                  value={option.name}
                                  onChange={(e) => {
                                    handleFilterChange("color", e.target.value);
                                    applyFilters();
                                  }}
                                  checked={filters.color.includes(option.name)}
                                />
                                <label htmlFor={option.id} className="ml-2">{option.name}</label>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                      {/* Fabric filter section */}
                      <div>
                        <label className="mb-0 cursor-pointer flex items-left justify-between bg-amber-200" onClick={() => setFabricExpanded(!fabricExpanded)}>
                          Fabric
                          {!fabricExpanded ? (
                            <AiOutlineCaretDown className="h-8" />
                          ) : (
                            <AiOutlineCaretUp className="h-8" />
                          )}
                        </label>
                        {fabricExpanded && (
                          <>
                            {fabric.map((option) => (
                              <div key={option.id} className="flex items-center mb-2">
                                <input
                                  type="checkbox"
                                  id={option.id}
                                  name="fabric"
                                  value={option.type}
                                  onChange={(e) => {
                                    handleFilterChange("fabric", e.target.value);
                                    applyFilters();
                                  }}
                                  checked={filters.fabric.includes(option.type)}
                                />
                                <label htmlFor={option.id} className="ml-2">{option.type}</label>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                      {/* Occasion filter section */}
                      <div>
                        <label className="mb-0 cursor-pointer flex items-left justify-between bg-amber-200" onClick={() => setOccasionExpanded(!occasionExpanded)}>Occasion
                          {!occasionExpanded ? (
                            <AiOutlineCaretDown className="h-8" />
                          ) : (
                            <AiOutlineCaretUp className="h-8" />
                          )}
                        </label>
                        {occasionExpanded && (
                          <>
                            {occasion.map((option) => (
                              <div key={option.id} className="flex items-center mb-2">
                                <input
                                  type="checkbox"
                                  id={option.id}
                                  name="occasion"
                                  value={option.type}
                                  onChange={(e) => {
                                    handleFilterChange("occasion", e.target.value);
                                    applyFilters();
                                  }}
                                  checked={filters.occasion.includes(option.type)}
                                />
                                <label htmlFor={option.id} className="ml-2">{option.type}</label>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                      {/* Fit filter section */}
                      <div>
                        <label className="mb-0 cursor-pointer flex items-left justify-between bg-amber-200" onClick={() => setFitExpanded(!fitExpanded)}>
                          Fit
                          {!fitExpanded ? (
                            <AiOutlineCaretDown className="h-8" />
                          ) : (
                            <AiOutlineCaretUp className="h-8" />
                          )}
                        </label>
                        {fitExpanded && (
                          <>
                            {fit.map((option) => (
                              <div key={option.id} className="flex items-center mb-2">
                                <input
                                  type="checkbox"
                                  id={option.id}
                                  name="fit"
                                  value={option.type}
                                  onChange={(e) => {
                                    handleFilterChange("fit", e.target.value);
                                    applyFilters();
                                  }}
                                  checked={filters.fit.includes(option.type)}
                                />
                                <label htmlFor={option.id} className="ml-2">{option.type}</label>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                      {/* Gender filter section */}
                      <div>
                        <label className="mb-0 cursor-pointer flex items-left justify-between bg-amber-200" onClick={() => setGenderExpanded(!genderExpanded)}>
                          Gender
                          {!genderExpanded ? (
                            <AiOutlineCaretDown className="h-8" />
                          ) : (
                            <AiOutlineCaretUp className="h-8" />
                          )}
                        </label>
                        {genderExpanded && (
                          <>
                            {gender.map((option) => (
                              <div key={option.id} className="flex items-center mb-2">
                                <input
                                  type="checkbox"
                                  id={option.id}
                                  name="gender"
                                  value={option.type}
                                  onChange={(e) => {
                                    handleFilterChange("gender", e.target.value);
                                    applyFilters();
                                  }}
                                  checked={filters.gender.includes(option.type)}
                                />
                                <label htmlFor={option.id} className="ml-2">{option.type}</label>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                      {/* Sleeve Type filter section */}
                      <div>
                        <label className="mb-0 cursor-pointer flex items-left justify-between bg-amber-200" onClick={() => setSleeveTypeExpanded(!sleeveTypeExpanded)}>Sleeve Type
                          {!sleeveTypeExpanded ? (
                            <AiOutlineCaretDown className="h-8" />
                          ) : (
                            <AiOutlineCaretUp className="h-8" />
                          )}
                        </label>
                        {sleeveTypeExpanded && (
                          <>
                            {sleeveType.map((option) => (
                              <div key={option.id} className="flex items-center mb-2">
                                <input
                                  type="checkbox"
                                  id={option.id}
                                  name="sleeveType"
                                  value={option.title}
                                  onChange={(e) => {
                                    handleFilterChange("sleeveType", e.target.value);
                                    applyFilters();
                                  }}
                                  checked={filters.sleeveType.includes(option.title)}
                                />
                                <label htmlFor={option.id} className="ml-2">{option.title}</label>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                      {/* Neck Type filter section */}
                      <div>
                        <label className="mb-0 cursor-pointer flex items-left justify-between bg-amber-200" onClick={() => setNeckTypeExpanded(!neckTypeExpanded)}>Neck Type
                          {!neckTypeExpanded ? (
                            <AiOutlineCaretDown className="h-8" />
                          ) : (
                            <AiOutlineCaretUp className="h-8" />
                          )}
                        </label>
                        {neckTypeExpanded && (
                          <>
                            {neckType.map((option) => (
                              <div key={option.id} className="flex items-center mb-2">
                                <input
                                  type="checkbox"
                                  id={option.id}
                                  name="neckType"
                                  value={option.title}
                                  onChange={(e) => {
                                    handleFilterChange("neckType", e.target.value);
                                    applyFilters();
                                  }}
                                  checked={filters.neckType.includes(option.title)}
                                />
                                <label htmlFor={option.id} className="ml-2">{option.title}</label>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                      {/* Customer Rating filter section */}
                      <div>
                        <label className="mb-0 cursor-pointer flex items-left justify-between bg-amber-200" onClick={() => setCustomerRatingExpanded(!customerRatingExpanded)}>
                          Customer Rating
                          {!customerRatingExpanded ? (
                            <AiOutlineCaretDown className="h-8" />
                          ) : (
                            <AiOutlineCaretUp className="h-8" />
                          )}
                        </label>
                        {customerRatingExpanded && (
                          <div className="flex flex-col">
                            <div className="mb-2">
                              <input
                                type="checkbox"
                                id="rating4"
                                value="4-5"
                                checked={filters.customerRating.includes("4-5")}
                                onChange={(e) => {
                                  handleFilterChange("customerRating", e.target.value);
                                  applyFilters();
                                }}
                              />
                              <label htmlFor="rating4" className="ml-2 mr-4">
                                4 and above
                              </label>
                            </div>

                            <div className="mb-2">
                              <input
                                type="checkbox"
                                id="rating3to4"
                                value="3-4"
                                checked={filters.customerRating.includes("3-4")}
                                onChange={(e) => {
                                  handleFilterChange("customerRating", e.target.value);
                                  applyFilters();
                                }}
                              />
                              <label htmlFor="rating3to4" className="ml-2 mr-4">
                                3 to 4
                              </label>
                            </div>

                            <div className="mb-2">
                              <input
                                type="checkbox"
                                id="rating3below"
                                value="1-3"
                                checked={filters.customerRating.includes("1-3")}
                                onChange={(e) => {
                                  handleFilterChange("customerRating", e.target.value);
                                  applyFilters();
                                }}
                              />
                              <label htmlFor="rating3below" className="ml-2">
                                3 and below
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Price Range filter section */}
                      <div className={`${styles.priceRangeContainer}`}>
                        <label className="mb-0 cursor-pointer flex items-left justify-between bg-amber-200" onClick={() => setPriceRangeExpanded(!priceRangeExpanded)}>Price Range
                          {!priceRangeExpanded ? (
                            <AiOutlineCaretDown className="h-8" />
                          ) : (
                            <AiOutlineCaretUp className="h-8" />
                          )}
                        </label>
                        {priceRangeExpanded && (
                          <div className="flex flex-col">
                            <div className="mb-2">
                              <input
                                type="checkbox"
                                id="price1-199"
                                value="1-199"
                                checked={filters.priceRange.includes("1-199")}
                                onChange={(e) => {
                                  handleFilterChange("priceRange", e.target.value);
                                  applyFilters();
                                }}
                              />
                              <label htmlFor="price1-199" className="ml-2 mr-4">
                                1 - 199
                              </label>
                            </div>
                            <div className="mb-2">
                              <input
                                type="checkbox"
                                id="price200-499"
                                value="200-499"
                                checked={filters.priceRange.includes("200-499")}
                                onChange={(e) => {
                                  handleFilterChange("priceRange", e.target.value);
                                  applyFilters();
                                }}
                              />
                              <label htmlFor="price200-499" className="ml-2 mr-4">
                                200 - 499
                              </label>
                            </div>
                            {/* Add other price range checkboxes similarly */}
                            <div className="mb-2">
                              <input
                                type="checkbox"
                                id="price500-999"
                                value="500-999"
                                checked={filters.priceRange.includes("500-999")}
                                onChange={(e) => {

                                  handleFilterChange("priceRange", e.target.value);
                                  applyFilters();
                                }}
                              />
                              <label htmlFor="price500-999" className="ml-2 mr-4">
                                500 - 999
                              </label>
                            </div>
                            <div className="mb-2">
                              <input
                                type="checkbox"
                                id="price1000-1999"
                                value="1000-1999"
                                checked={filters.priceRange.includes("1000-1999")}
                                onChange={(e) => {
                                  handleFilterChange("priceRange", e.target.value);
                                  applyFilters();
                                }}
                              />
                              <label htmlFor="price1000-1999" className="ml-2 mr-4">
                                1000 - 1999
                              </label>
                            </div>
                            <div className="mb-2">
                              <input
                                type="checkbox"
                                id="price2000-3999"
                                value="2000-3999"
                                checked={filters.priceRange.includes("2000-3999")}
                                onChange={(e) => {
                                  handleFilterChange("priceRange", e.target.value);
                                  applyFilters();
                                }}
                              />
                              <label htmlFor="price2000-3999" className="ml-2 mr-4">
                                2000 - 3999
                              </label>
                            </div>
                            <div className="mb-2">
                              <input
                                type="checkbox"
                                id="price4000-4999"
                                value="4000-4999"
                                checked={filters.priceRange.includes("4000-4999")}
                                onChange={(e) => {
                                  handleFilterChange("priceRange", e.target.value);
                                  applyFilters();
                                }}
                              />
                              <label htmlFor="price4000-4999" className="ml-2 mr-4">
                                4000 - 4999
                              </label>
                            </div>
                            <div className="mb-2">
                              <input
                                type="checkbox"
                                id="price5000-9999"
                                value="5000-9999"
                                checked={filters.priceRange.includes("5000-9999")}
                                onChange={(e) => {
                                  handleFilterChange("priceRange", e.target.value);
                                  applyFilters();
                                }}
                              />
                              <label htmlFor="price5000-9999" className="ml-2 mr-4">
                                5000-9999
                              </label>
                            </div>
                            <div className="mb-2">
                              <input
                                type="checkbox"
                                id="price10000-1000000000"
                                value="10000-1000000000"
                                checked={filters.priceRange.includes("10000-1000000000")}
                                onChange={(e) => {
                                  handleFilterChange("priceRange", e.target.value);
                                  applyFilters();
                                }}
                              />
                              <label htmlFor="price10000-1000000000" className="ml-2 mr-4">
                                10000 and above
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* <button className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={applyFilters}>
                    Apply Filters
                  </button> */}
                    </div>

                  </div>
                )}
              </div>
            </div>
            <div className="w-1/2 relative" ref={sortRef}>
              <div>
                <button onClick={() => setSortIsOpen((prev) => !prev)} className="w-full bg-yellow-400 p-1 mt-1 flex items-center justify-between font-bold text-lg rounded-2xl tracking-wider border-4 border-transparent active:border-blue-100 duration-300 active:text-blue-500">
                  Sort By
                  {!SortisOpen ? (
                    <AiOutlineCaretDown className="h-8" />
                  ) : (
                    <AiOutlineCaretUp className="h-8" />
                  )}
                </button>
                {/* {SortisOpen && (
                  <div className="bg-amber-100 absolute w-full z-20">
                    <div className={`${styles.sortContainer}`}>
                      <select
                        className="w-full p-2 bg-amber-200"
                        onChange={(e) =>
                          handleFilterChange("sortBy", e.target.value)
                        }
                        value={filters.sortBy}
                      >
                        <option value="" className="bg-amber-100">Select</option>
                        <option value="priceHighToLow" className="bg-amber-100">Price (High to Low)</option>
                        <option value="priceLowToHigh" className="bg-amber-100">Price (Low to High)</option>
                        <option value="latest">Latest</option>
                      </select>
                    </div>
                  </div>
                )} */}
                {SortisOpen && (
                  <div className="bg-amber-200 absolute w-full z-20">
                    {/* Add sorting*/}
                    <div className={`${styles.sortContainer}`}>
                      <div className="flex flex-col">
                        {/* <div className="flex items-center mb-2">
                          <input
                            type="radio"
                            id="sortByLatest"
                            name="sortBy"
                            value="latest"
                            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                            checked={filters.sortBy === "latest"}
                            className="mr-1"
                          />
                          <label htmlFor="sortByLatest">Latest</label>
                        </div> */}
                        <div className="flex items-center mb-2">
                          <input
                            type="radio"
                            id="sortByPriceHighToLow"
                            name="sortBy"
                            value="priceHighToLow"
                            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                            checked={filters.sortBy === "priceHighToLow"}
                            className="mr-1"
                          />
                          <label htmlFor="sortByPriceHighToLow">Price (High to Low)</label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="sortByPriceLowToHigh"
                            name="sortBy"
                            value="priceLowToHigh"
                            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                            checked={filters.sortBy === "priceLowToHigh"}
                            className="mr-1"
                          />
                          <label htmlFor="sortByPriceLowToHigh">Price (Low to High)</label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        <div className={`${styles.section}`}>
        <div className="pt-2 hidden md:block">
          {/* <div className="grid grid-cols-2 gap-[20px] md:gap-[25px] lg:gap-[25px] xl:gap-[30px] mb-12"> ye pehle sae for 2 cards by chatgpt */}
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 ">             
          {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
          </div>

          </div>
          <div className="pt-2 md:hidden">
            <div className="grid grid-cols-2 gap-[25px] md:grid-cols-2 md:gap-[25px] mb-12 "> 
            {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
            </div>
            </div>
        </div>
        <Footer />
        </div>
    )}
    </>
  );
};

export default BestSellingPage;
