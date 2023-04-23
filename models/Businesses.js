const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const businessSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  slogan: String,
  website: String,
  facebook: String,
  instagram: String,
  category: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    }
  },
  images: [Object],
  benefits: [String],
  description: String,
  price:Number,
  user:{type:mongoose.Schema.Types.ObjectId,ref:"Users"},
  author:String

},{timestamps:true});

businessSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Business', businessSchema);
