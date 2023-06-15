const { default: mongoose } = require("mongoose")

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, default: null },
  description: { type: String, unique: true },
  price: { type: String },
  isProductInWishlist: { type: Boolean, default: false },
  isProductInCart: { type: Boolean, default: false },
  status: { type: String, enum: ['AVAILABLE', 'OUT_OF_STOCK'] },
  category: {
    type: String,
    enum: ['WALLET', 'BELT', 'BRACELET', 'GLASSES'],
  },
  images: { type: Schema.Types.Array },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
}
});

module.exports = mongoose.model('Product', productSchema);
