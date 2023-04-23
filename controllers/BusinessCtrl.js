const Business = require('../models/Businesses');
const Users=require('../models/Users')
// Create a new business
exports.createBusiness = (req, res, next) => {
 const coordinate=JSON.parse(req.body.coordinates)
  const business = new Business({
    name: req.body.name,
    slogan: req.body.slogan,
    website: req.body.website,
    facebook: req.body.facebook,
    instagram: req.body.instagram,
    category: req.body.category,
    location: {
      type: 'Point',
      coordinates: coordinate
    },
    benefits: req.body.benefits,
    description: req.body.description,
    images: req.files,
    price:req.body.price,
    user:req.id,
    author:req.body.author
  });
  business.save()
    .then(async(createdBusiness) => {
      await Users.findByIdAndUpdate(req.id, { $push: { businesses: createdBusiness._id } })
      res.status(201).json({
        message: 'Your Business added successfully',
        business: createdBusiness
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Failed to add business',
        error: error
      });
    });
};

// Get a list of all businesses
exports.getBusinesses = (req, res, next) => {
  const searchName = req.query.name ? new RegExp(req.query.name, 'i') : null;
  const searchCategory = req.query.category ? req.query.category : null;
  const searchLocation = req.query.location ? JSON.parse(req.query.location) : null;

  const query = {
    $and: [
      searchCategory ? { category: searchCategory } : {},
      searchName ? { name: searchName } : {},
      searchLocation ? {
        location: {
          $geoWithin: {
            $centerSphere: [searchLocation.coordinates, searchLocation.radius / 3963.2]
          }
        }
      } : {}
    ]
  };
  
  Business.find(query).sort("-createdAt").limit(30)
    .then(businesses => {
      res.status(200).json({
        message: 'Businesses fetched successfully',
        businesses: businesses
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Failed to fetch businesses',
        error: error
      });
    });
};





// Get a single business by ID
exports.getBusinessById = (req, res, next) => {
  Business.findById(req.params.id)
    .then(business => {
      if (business) {
        res.status(200).json({
          message: 'Business fetched successfully',
          business: business
        });
      } else {
        res.status(404).json({
          message: 'Business not found'
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Failed to fetch business',
        error: error
      });
    });
};

// Update a business by ID
exports.updateBusinessById = (req, res, next) => {
  const business = new Business({
    _id: req.params.id,
    name: req.body.name,
    slogan: req.body.slogan,
    website: req.body.website,
    facebook: req.body.facebook,
    instagram: req.body.instagram,
    category: req.body.category,
    location: {
      type: 'Point',
      coordinates: req.body.coordinates
    },
    benefits: req.body.benefits,
    description: req.body.description,
    images: req.body.images
  });
  Business.updateOne({ _id: req.params.id }, business)
    .then(result => {
      if (result.nModified > 0) {
        res.status(200).json({
          message: 'Business updated successfully',
          result: result
        });
      } else {
        res.status(404).json({
          message: 'Business not found'
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'Failed to update business',
        error: error
      });
    });
};

// Delete a business by ID
exports.deleteBusinessById = (req, res, next) => {
    Business.deleteOne({ _id: req.params.id })
      .then(result => {
        if (result.deletedCount > 0) {
          res.status(200).json({
            message: 'Business deleted successfully',
            result: result
          });
        } else {
          res.status(404).json({
            message: 'Business not found'
          });
        }
      })
      .catch(error => {
        res.status(500).json({
          message: 'Failed to delete business',
          error: error
        });
      });
  };