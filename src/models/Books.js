import mongoose from "mongoose";

const booksSchema = new mongoose.Schema({
    tittle: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    author: {
        type: String,
        required: true
    }
});

export default mongoose.models.Books || mongoose.model("Books", booksSchema);