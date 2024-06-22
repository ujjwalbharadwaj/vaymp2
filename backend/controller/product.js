const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Kuchvi = require("../model/kuchvi");
const Order = require("../model/order");

const Shop = require("../model/shop");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");

router.post(
  "/create-product",
  // isAuthenticated,
  // isAdmin("Admin"),
  
  catchAsyncErrors(async (req, res, next) => {

    try {
      const shopId = req.body.shopId;
      if (!shopId) {
        return next(new ErrorHandler("Shop Id is required!", 400));
      }

      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
      }

      let images = [];

      if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else {
        images = req.body.images;
      }
      

      // Validate other data fields here
      const { name, category,subCategory, ShopPrice,originalPrice, discountPrice, stock,gender,color } = req.body;
      // console.log(req.body)
      if (!name  || !category  ||!subCategory ||!ShopPrice||!originalPrice ||  !discountPrice || !stock || !gender || !color|| !images) {
        console.log("object1111",originalPrice)
        
        return next(new ErrorHandler("Invalid product data. Please provide all required fields.", 400));

      }

      const imagesLinks = [];
    
      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });
    
        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    
      const productData = { ...req.body, images: imagesLinks };
      productData.shop = shop;

      const product = await Product.create(productData);
//       console.log("object",abc)
// console.log("productdata",productData)
// console.log("product",product)

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      return next(new ErrorHandler(error.message, 400));
    }
  })
);

router.patch("/update-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {  listing } = req.body;

    console.log('Received ID:', id);
    console.log('Received listing type:', listing);

    const product = await Product.findByIdAndUpdate(
      id,
      { listing: listing },
      { new: true }
    );

    if (!product) {
      console.log('Product not found');
      return res.status(404).send('Product not found');
    }

    console.log('Updated product:', product);
    res.send(product);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Server error');
  }
});



// get all products of a shop
router.get(
  "/get-all-products-shop/:id",
  
    catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id });
      const pro= products.filter((p)=>p.listing!="Event" && p.shop.shopIsActive===false)

      const filteredProducts = pro.filter(product =>
        product.stock.some(stockItem => stockItem.quantity > 0)
      );

      res.status(201).json({
        success: true,
        products: filteredProducts,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
//delete products from shop
router.delete(
  "/delete-shop-product/:id",
  isAuthenticated,
  isAdmin("Admin"),
  
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;
      console.log('Product ID:', productId); // Debugging statement

      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        return next(new ErrorHandler("Product not found with this id", 404));
      }

      for (let i = 0; i < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(
          product.images[i].public_id
        );
        console.log("Image deleted from cloudinary:", result);
      }

      if (typeof product.remove !== 'function') {
        return next(new ErrorHandler("Cannot delete product. Remove method not available.", 500));
      }

      await product.remove();

      console.log("Product deleted from database:", productId);

      res.status(200).json({
        success: true,
        message: "Product deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      return next(new ErrorHandler("Error deleting product", 500));
    }
  })
);

// get all products
router.get(
  '/get-all-products',
  catchAsyncErrors(async (req, res, next) => {
    try {
      // Pagination parameters
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 30;
      // console.log('Pagination Params:', { page, perPage }); // Log pagination params

      // Sorting parameters
      let sortBy = ""; // Initialize sortBy variable
let sortOrder = -1; // Default sort order is descending (high to low)

if (req.query.sortBy === "priceHighToLow") {
  sortBy = "discountPrice"; // Sort by price (high to low)
} else if (req.query.sortBy === "priceLowToHigh") {
  sortBy = "discountPrice"; // Sort by price (low to high)
  sortOrder = 1; // Change sort order to ascending (low to high)
} else if (req.query.sortBy === "latest") {
  sortBy = "-createdAt"; // Sort by latest
} else {
  sortBy = "originalPrice"; // Default sort by originalPrice
}


      // Filtering parameters
      const filters = {
        'shop.shopIsActive': false, // Filter to include only products with inactive shops
      };
      if (req.query.category) {
        filters.category = { $in: req.query.category.split(',') };
      }
      if (req.query.subCategory) {
        filters.subCategory = { $in: req.query.subCategory.split(',') };
      }
      if (req.query.sleeveType) {
        filters.sleeveType = { $in: req.query.sleeveType.split(',') };
      }
      if (req.query.neckType) {
        filters.neckType = { $in: req.query.neckType.split(',') };
      }
      if (req.query.color) {
        filters.color = { $in: req.query.color.split(',') };
      }
      if (req.query.fit) {
        filters.fit = { $in: req.query.fit.split(',') };
      }
      if (req.query.fabric) {
        filters.fabric = { $in: req.query.fabric.split(',') };
      }
      if (req.query.gender) {
        filters.gender = { $in: req.query.gender.split(',') };
      }
      if (req.query.occasion) {
        filters.occasion = { $in: req.query.occasion.split(',') };
      }
      if (req.query.size) {
        filters['stock.size'] = { $in: req.query.size.split(',') };
      }
      if (req.query.customerRating) {
        const ratingRanges = req.query.customerRating.split(','); // Split multiple ranges
        const ratingFilters = ratingRanges.map((range) => {
          const [minRating, maxRating] = range.split('-').map(parseFloat);
          return { ratings: { $gte: minRating, $lte: maxRating } };
        });
        filters.$or = ratingFilters;
      }
      
      if (req.query.priceRange) {
        const priceRanges = req.query.priceRange.split(','); // Split multiple ranges
        let minPrice = Infinity;
        let maxPrice = -Infinity;
        priceRanges.forEach((range) => {
          const [min, max] = range.split('-').map(parseFloat);
          minPrice = Math.min(minPrice, min);
          maxPrice = Math.max(maxPrice, max);
        });
        filters.discountPrice = { $gte: minPrice, $lte: maxPrice };
      }

      // Query products with filtering, sorting, and pagination
      const allProducts = await Product.find(filters)
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * perPage)
        .limit(perPage);
      const pro= allProducts.filter((p)=>p.listing!="Event")
      // Filter out products with zero quantity in all sizes
      const products = pro.filter(product => {
        return product.stock.some(stockItem => stockItem.quantity > 0);
      });
      // Count total products for pagination
      const totalCount = await Product.countDocuments(filters);

      res.status(200).json({
        success: true,
        products,
        totalCount,
        totalPages: Math.ceil(totalCount / perPage),
      });
    } catch (error) {
      console.error('Error:', error); // Log error
      return next(new ErrorHandler(error, 400));
    }
  })
);












router.get(
  "/get-all-searched-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { query, page = 1, limit = 6, color, size, brand, neckType, sleeveType, subCategory, fabric, occasion, fit, gender, customerRating, priceRange, sortBy } = req.query;
      let words = query.toLowerCase().split(" ");

      // Remove the word "for" from the search terms
      words = words.filter(word => word !== "for");
      const quer = words.join(" ");
      console.log("req.query", req.query);
      

      // Fetch all products
      let filteredProducts = await Product.find({ 'shop.shopIsActive': false }).sort({ createdAt: -1 });

      // Apply gender filter
      if (quer.includes("female") || quer.includes("females") || quer.includes("women") || quer.includes("woman") ||
          quer.includes("womans") || quer.includes("womens") || quer.includes("ladies") || quer.includes("lady") ||
          quer.includes("girl") || quer.includes("gurl") || quer.includes("girls") || quer.includes("ladki") ||
          quer.includes("ldki") || quer.includes("gurls")) {
        filteredProducts = filteredProducts.filter(val => 
          val.gender?.toLowerCase() === "women" || 
          val.gender?.toLowerCase() === "girls" || 
          val.gender?.toLowerCase().includes('girl') || 
          val.gender?.toLowerCase() === "boys & girls"
        );
      } else if (quer.includes("male") || quer.includes("males") || quer.includes("mans") || quer.includes("boys") || 
                 quer.includes("men") || quer.includes("mens") || quer.includes("guys") || quer.includes("ladka") || 
                 quer.includes("boy") || quer.includes("man")) {
        filteredProducts = filteredProducts.filter(val => 
          val.gender?.toLowerCase() === "men" || 
          val.gender?.toLowerCase() === "boys & girls" || 
          val.gender?.toLowerCase().includes('boy') || 
          val.gender?.toLowerCase().includes('boys')
        );
      }

      // Apply category filter
      if (quer.includes("shoes") || quer.includes("shoe") || quer.includes("joota") || quer.includes("juta") || 
          quer.includes("jhoota") || quer.includes("jutta")) {
        filteredProducts = filteredProducts.filter(val => val.category?.toLowerCase() === "shoes");
      } else if (quer.includes("accessories") || quer.includes("sunglasses") || quer.includes("jhumka") || quer.includes("jumka") ||
                 quer.includes("caps") || quer.includes("earrings") || quer.includes("watches") || quer.includes("belts") ||
                 quer.includes("bracelets") || quer.includes("bags") || quer.includes("purse") || quer.includes("wallets") ||
                 quer.includes("trolley") || quer.includes("hat") || quer.includes("scarfs") || quer.includes("stoles") ||
                 quer.includes("leatherbelts") || quer.includes("smartwatches") || quer.includes("digitalwatches") ||
                 quer.includes("analogwatches") || quer.includes("hairbands") || quer.includes("gloves") ||
                 quer.includes("drivinggloves")) {
        filteredProducts = filteredProducts.filter(val => val.category?.toLowerCase() === "accessories");
      } else if (quer.includes("clothes") || quer.includes("shirt") || quer.includes("dresses") || quer.includes("cloths") || 
                 quer.includes("cloth") || quer.includes("kapra") || quer.includes("dress")) {
        filteredProducts = filteredProducts.filter(val => val.category?.toLowerCase() !== "accessories" && val.category?.toLowerCase() !== "shoes");
      }

      // Apply keyword filtering (if no gender or category filters were applied)
      const filterByWord = (product, word) => {
        const productProperties = [
          product?.size,
          product?.color,
          product?.subCategory,
          product?.fabric,
          product?.occasion,
          product?.fit,
          product?.sleeveType,
          product?.neckType,
          product?.name,
          product?.tags,
          product?.brand,
        ];
        return productProperties.some(prop => prop && prop.toLowerCase().includes(word));
      };

      words.forEach((word) => {
        const filtered = filteredProducts.filter(product => filterByWord(product, word));
        if (filtered.length > 0) {
          filteredProducts = filtered;
        }
      });

      // Apply additional filters
      if (color) {
        const colorsArray = color.split(',').map(c => c.trim());
        filteredProducts = filteredProducts.filter(product =>
          colorsArray.some(selectedColor =>
            product.color?.toLowerCase() === selectedColor.toLowerCase()
          )
        );
      }

      if (subCategory) {
        const subCategoryArray = subCategory.split(',').map(c => c.trim());
        filteredProducts = filteredProducts.filter(product =>
          subCategoryArray.some(selectedSubCategory =>
            product.subCategory?.toLowerCase() === selectedSubCategory.toLowerCase()
          )
        );
      }

      if (neckType) {
        const neckTypeArray = neckType.split(',').map(c => c.trim());
        filteredProducts = filteredProducts.filter(product =>
          neckTypeArray.some(selectedNeckType =>
            product.neckType?.toLowerCase() === selectedNeckType.toLowerCase()
          )
        );
      }

      if (sleeveType) {
        const sleeveTypeArray = sleeveType.split(',').map(c => c.trim());
        filteredProducts = filteredProducts.filter(product =>
          sleeveTypeArray.some(selectedSleeveType =>
            product.sleeveType?.toLowerCase() === selectedSleeveType.toLowerCase()
          )
        );
      }

      if (size) {
        const sizesArray = size.split(',').map(s => s.trim());
        filteredProducts = filteredProducts.filter(product => 
          sizesArray.some(selectedSize => 
            product.stock.some(stockItem => stockItem.size.toLowerCase() === selectedSize.toLowerCase())
          )
        );
      }

      if (brand) {
        const brandsArray = brand.split(',').map(c => c.trim());
        filteredProducts = filteredProducts.filter(product => 
          brandsArray.some(selectedBrand =>
            product.brand?.toLowerCase() === selectedBrand.toLowerCase()
          )
        );
      }

      if (fit) {
        const fitsArray = fit.split(',').map(c => c.trim());
        filteredProducts = filteredProducts.filter(product => 
          fitsArray.some(selectedFit =>
            product.fit?.toLowerCase() === selectedFit.toLowerCase()
          )
        );
      }

      if (occasion) {
        const occasionsArray = occasion.split(',').map(c => c.trim());
        filteredProducts = filteredProducts.filter(product => 
          occasionsArray.some(selectedOccasion =>
            product.occasion?.toLowerCase() === selectedOccasion.toLowerCase()
          )
        );
      }

      if (fabric) {
        const fabricsArray = fabric.split(',').map(c => c.trim());
        filteredProducts = filteredProducts.filter(product => 
          fabricsArray.some(selectedFabric =>
            product.fabric?.toLowerCase() === selectedFabric.toLowerCase()
          )
        );
      }

      if (gender) {
        const gendersArray = gender.split(',').map(c => c.trim());
        filteredProducts = filteredProducts.filter(product => 
          gendersArray.some(selectedGender =>
            product.gender?.toLowerCase() === selectedGender.toLowerCase()
          )
        );
      }

      if (customerRating) {
        const ratingRanges = customerRating.split(',');
        filteredProducts = filteredProducts.filter(product => 
          ratingRanges.some(range => {
            if (range === "3-and-below") {
              return product.ratings <= 3;
            } else if (range === "3-to-4") {
              return product.ratings > 3 && product.ratings <= 4;
            } else if (range === "4-and-above") {
              return product.ratings > 4;
            }
            return false;
          })
        );
      }


      if (priceRange) {
        const priceRanges = priceRange.split(','); 
        let minPrice = Infinity;
        let maxPrice = -Infinity;
        priceRanges.forEach((range) => {
          const [min, max] = range.split('-').map(parseFloat);
          minPrice = Math.min(minPrice, min);
          maxPrice = Math.max(maxPrice, max);
        });
        filteredProducts = filteredProducts.filter(product => 
          product.discountPrice >= minPrice && product.discountPrice <= maxPrice
        );
      }
      filteredProducts = filteredProducts.filter(product =>
        product.listing!="Event")

            // Filter out products with zero quantity in all sizes
            filteredProducts = filteredProducts.filter(product =>
              product.stock.some(stockItem => stockItem.quantity > 0)
            );
      

      // Apply sorting
      if (sortBy) {
        const sortFields = {
          'price-asc': { discountPrice: 1 },
          'price-desc': { discountPrice: -1 },
          'rating-asc': { ratings: 1 },
          'rating-desc': { ratings: -1 },
          'date-asc': { createdAt: 1 },
          'date-desc': { createdAt: -1 }
        };
        const sortOrder = sortFields[sortBy] || { createdAt: -1 };
        filteredProducts = filteredProducts.sort((a, b) => {
          for (let field in sortOrder) {
            if (a[field] < b[field]) return sortOrder[field] === 1 ? -1 : 1;
            if (a[field] > b[field]) return sortOrder[field] === 1 ? 1 : -1;
          }
          return 0;
        });
      }

      console.log("filteredProducts", filteredProducts.length);

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      res.status(200).json({
        success: true,
        products: paginatedProducts,
        totalProducts: filteredProducts.length,
        currentPage: page,
        totalPages: Math.ceil(filteredProducts.length / limit)
      });
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching products."
      });
    }
  })
);






































// review for a product
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, kuchviId,orderId } = req.body;

      const product = await Product.findById(productId);
      const order = await Order.findById(orderId);

      const review = {
        user,
        rating,
        comment,
        productId,
        kuchviId,
        orderId
      };

      const isReviewed = product.reviews.find(
        (rev) => rev.user._id.toString() === user._id.toString()
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id.toString() === user._id.toString()) {
            rev.rating = rating;
            rev.comment = comment;
            rev.user = user;
          }
        });
      } else {
        product.reviews.push(review);
      }

      let avg = 0;
      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });
      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      if (order) {
        order.cart.forEach((item) => {
          if (item.productId.toString() === productId.toString()) {
            item.isReviewed = true;
          }
        });
        await order.save({ validateBeforeSave: false });
      }

      res.status(200).json({
        success: true,
        message: "Reviewed successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all products --- for admin
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });

      const filteredProducts = products.filter((product) => product.listing !== "Event");

      res.status(201).json({
        success: true,
        products: filteredProducts,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);




// Update stock for a single product
router.patch(
  "/update-stock/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;
      const { stock, sold_out } = req.body; // New stock object from the request body

      // Find the product by ID in the database
      const product = await Product.findById(productId);

      // Check if the product exists
      if (!product) {
        return next(new ErrorHandler(`Product not found with ID: ${productId}`, 404));
      }

      // Update the product's stock with the new stock array
      product.stock = stock;

      // Save the updated product
      await product.save();

      // Send success response
      res.status(200).json({
        success: true,
        message: "Product stock updated successfully",
        product,
      });
    } catch (error) {
      console.error("Error updating product stock:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);




// Update stock for a single product
router.patch(
  "/seller-update-stock/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const productId = req.params.id;
      const { size, quantity } = req.body; // New size and quantity from the request body

      // Find the product by ID in the database
      const product = await Product.findById(productId);

      // Check if the product exists
      if (!product) {
        return next(new ErrorHandler(`Product not found with ID: ${productId}`, 404));
      }

      // Find the index of the size in the stock array
      const sizeIndex = product.stock.findIndex((item) => item.size === size);

      // Update the quantity of the specific size if found, otherwise add a new entry
      if (sizeIndex !== -1) {
        product.stock[sizeIndex].quantity = quantity;
      } else {
        product.stock.push({ size, quantity });
      }

      // Save the updated product
      await product.save();

      // Send success response
      res.status(200).json({
        success: true,
        message: `Stock for size ${size} updated successfully`,
        product,
      });
    } catch (error) {
      console.error("Error updating product stock:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);



module.exports = router;
