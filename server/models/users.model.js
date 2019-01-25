import mongoose from "mongoose";
const Schema = mongoose.Schema;
import bcrypt from "bcryptjs";

const UsersSchema = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false,
    collection: "UsersCollection"
});

UsersSchema.pre('save', function (next) {
    if (this.isModified('password') || this.isNew()) {
        this.password = bcrypt.hashSync(this.password, 12);
    }
    next();
});

export default mongoose.model("UsersModel", UsersSchema);