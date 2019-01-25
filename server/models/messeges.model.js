"use strict";

import mongoose from "mongoose";
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    date: {type: Date},
    content: {type: String},
    username: {type: String}
}, {
    versionKey: false,
    collection: "MessageCollection"
});

export default mongoose.model("MessageSchema", MessageSchema);