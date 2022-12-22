const mongoose = require('mongoose');

const province = new mongoose.Schema({
    province_id: {
        require: true,
        type: String
    },
    province_name: {
        require: true,
        type: String
    },
})

// module.exports = mongoose.model("Province", provinceSchema)

const district = new mongoose.Schema({
    district_id: {
        require: true,
        type: String
    },
    district_name: {
        require: true,
        type: String
    },
    province_id: {
        type: String
    },
})

const ward = new mongoose.Schema({
    ward_id: {
        require: true,
        type: String
    },
    ward_name: {
        require: true,
        type: String
    },
    district_id: {
        type: String
    }
})

// module.exports = mongoose.model("District", districtSchema)
const provinceSchema = mongoose.model('province', province)
// provinceSchema.createIndexes({'province_id': 1})
const districtSchema = mongoose.model('district', district)
const wardSchema = mongoose.model('ward', ward)

module.exports = {Province: provinceSchema, District: districtSchema, Ward: wardSchema}