const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            require: true,
            trim: true
        },
        email: {
            type: String,
            require: true,
            unique: true,
        },
        password: {
            type: String,
            require: true,
            minlength: 6,
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'shop'],
            default: "user"
        },
        age: {
            type: Number,
            min: 1,
            max: 120
        },
        phoneNumber: {
            type: String,
        },
        avatar: {
            type: String,
        },
        shippingAddress: [
            {
                street: { type: String, require: true },
                city: { type: String, require: true },
                district: { type: String, require: true },
                ward: { type: String, require: true },
            },
        ],

        favouriteProducts: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        ],

        isActive: {
            type: Boolean,
            default: true,
        },

    },
    { timestamps: true }
)

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
