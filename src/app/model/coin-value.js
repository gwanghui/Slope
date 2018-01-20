import mongoose from "mongoose";
let Schema = mongoose.Schema;

export const coinValueSchema = new Schema({
    openTime: {
        type: Number,
    },
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    closeTime: Number,
    coinName: String,
    key:  {
        type: String,
        unique: true
    }
});

export const coinModel = mongoose.model("coin",coinValueSchema,'coin');

