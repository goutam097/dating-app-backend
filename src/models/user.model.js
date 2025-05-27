const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const images = mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    last_name: {
      type: String,
      trim: true,
      default: '',
    },
    full_name: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    password: {
      type: String,
      required: false,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    marital_status: {
      type: String,
      enum: ['single', 'single_with_kids', 'widowed', 'widowed_with_kids', 'divorced', 'divorced_with_kids', 'separated', 'separated_with_kids'],
    },
    dob: {
      type: String,
      default: '',
    },
    address: {
      type: Object,
      default: {
        location: '',
        city: '',
        state: '',
        country: '',
        pin_code: null,
      },
    },
    images: [images],
    role: {
      type: String,
      required: false,
      enum: ['user', 'admin'],
      default: 'user',
    },
    status: {
      type: Boolean,
      default: true,
    },
    otp: {
      type: String,
    },
    height: {
      type: String,
    },
    religion: {
      type: String,
      enum: ['hindu', 'spiritual', 'muslim', 'christian', 'atheist', 'agnostic', 'buddhist', 'jewish', 'sikh', 'jain', 'bahai', 'other'],
    },
    mother_tongue: {
      type: String,
    },
    other_language: {
      type: String,
    },
    smoking: {
      type: String,
      enum: ['regularly', 'sometimes', 'never'],
      default: 'never',
    },
    drinking: {
      type: String,
      enum: ['regularly', 'sometimes', 'never'],
      default: 'never',
    },
    relationship_goal: {
      type: String,
    },
    occupation: {
      type: String,
    },
    income: {
      type: String,
    },
    interests: [{
      type: String,
    }],
    about: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  if (user.isModified('first_name') || user.isModified('last_name')) {
    user.full_name = `${user.first_name} ${user.last_name}`;
  }
  next();
});

userSchema.index({ 'address.location': '2dsphere' });


const User = mongoose.model('User', userSchema);

module.exports = User;
