const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema (
    {
        title: { type: String, required: true, trim: true },

        thumbnail: { type: String, required: true },

        description: { type: String, required: true },

        slug: { type: String, required: true, unique: true, trim: true },

        content: { type: String.Type.Mixed , default: null },

    },
    { timestamps: true }
);

module.exports = mongoose.model("Content", contentSchema);
