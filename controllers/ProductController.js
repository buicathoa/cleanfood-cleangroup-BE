const { handleError, handleSuccess } = require("../utils/handleResponse");
const ProductModel = require("../models/ProductModel");
const ProductController = {
  createProduct: async (req, res) => {
    const {
      title,
      sub_title,
      description,
      price_per_meal,
      url_generated,
      product_type
    } = req.body;
    const image = req.file.path; 
    try {
      const newProduct = await new ProductModel({
        title: title,
        sub_title: sub_title,
        description: description,
        image: image,
        price_per_meal: price_per_meal,
        url_generated: url_generated,
        product_type: product_type
      }); 
      const Product = await newProduct.save();
      return handleSuccess(
        res,
        Product,
        "Create product successfully!"
      );
    } catch (err) {
      return handleError(err);
    }
  },
  getAllProduct: async (req, res) => {
    const {product_type} = req.body;
    try {
      // const comboPackageFoundAndUpdate = await ComboPackage.findByIdAndUpdate(comboPackage_id, {weekdays: list_weekday_id})
      const AllSpecificProduct = await ProductModel.find({product_type: product_type});
      return handleSuccess(
        res,
        AllSpecificProduct,
        "Get all products successfully!"
      );
    } catch (err) {
      return handleError(err);
    }
  },
  getProductbyRoute: async (req, res) => {
    const {route} = req.body
    try {
      const ProductFound = await ProductModel.findOne({url_generated: route});
      if(ProductFound.length === 0) {
        return res.status(404).json("Can't find combo package")
      } else {
        return handleSuccess(
          res,
          ProductFound,
          "Get combo package successfully"
        );
      }
    } catch (err) {
      return handleError(err);
    }
  },
};

module.exports = ProductController;
