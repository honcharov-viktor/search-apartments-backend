const uuid = require('uuid');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const Apartment = new Schema({
  id: {
    type: Schema.Types.String,
    index: {
      unique: true,
    },
    default: uuid.v4,
  },
  url: {
    type: Schema.Types.String,
    index: {
      unique: true,
    },
  },
  rawHtml: {
    type: Schema.Types.String,
  },
  title: {
    type: Schema.Types.String,
  },
  description: {
    type: Schema.Types.String,
  },
  rawPrice: {
    type: Schema.Types.String,
  },
  price: {
    type: Schema.Types.Number,
  },
  position: {
    type: Schema.Types.Object,
    default: null,
  },
  parsed: {
    type: Schema.Types.Boolean,
    default: false,
  },
}, {
  collection: 'apartments',
  timestamps: true,
});

module.exports = mongoose.model('Apartment', Apartment);
