const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    author: { type: String, required: true },
    place: { type: String, required: true },
    description: { type: String, required: true },
    hashtags: String,
    image: { type: String, required: true },
    likes: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

PostSchema.virtual("imageFulPath").get(function() {
  return `${process.env.BASE_URL}/files/${encodeURIComponent(this.image)}`;
});

module.exports = mongoose.model("Post", PostSchema);
