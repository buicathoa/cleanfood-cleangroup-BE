const { handleError, handleSuccess } = require("../utils/handleResponse");
const ComboPackage = require("../models/ComboPackage");
const comboPackageController = {
  createComboPackage: async (req, res) => {
    const {
      package_title,
      package_sub_title,
      package_description,
      price_per_meal,
      packageUrlgen
    } = req.body;
    const image = req.file.path; 
    try {
      const newComboPackage = await new ComboPackage({
        package_title: package_title,
        package_sub_title: package_sub_title,
        package_description: package_description,
        package_image: image,
        price_per_meal: price_per_meal,
        package_url_generated: packageUrlgen,
      }); 
      const comboPackage = await newComboPackage.save();
      return handleSuccess(
        res,
        comboPackage,
        "Create combo package successfully!"
      );
    } catch (err) {
      return handleError(err);
    }
  },
  getAllComboPackage: async (req, res) => {;
    try {
      // const comboPackageFoundAndUpdate = await ComboPackage.findByIdAndUpdate(comboPackage_id, {weekdays: list_weekday_id})
      const allComboPackage = await ComboPackage.find({});
      return handleSuccess(
        res,
        allComboPackage,
        "Get all combo package successfully!"
      );
    } catch (err) {
      return handleError(err);
    }
  },
  getComboPackageByRoute: async (req, res) => {
    const {route} = req.body
    try {
      const ComboPackageFound = await ComboPackage.findOne({package_url_generated: route});
      if(ComboPackageFound.length === 0) {
        return res.status(404).json("Can't find combo package")
      } else {
        return handleSuccess(
          res,
          ComboPackageFound,
          "Get combo package successfully"
        );
      }
    } catch (err) {
      return handleError(err);
    }
  },
};

module.exports = comboPackageController;
