const { default: mongoose } = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  },
  wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  cart: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
