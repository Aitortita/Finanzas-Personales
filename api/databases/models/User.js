"use strict";
const UserSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userName: { type: String, require: true },
    lastName: String,
    email: { type: String, unique: true, lowercase: true },
    password: { type: String, select: false },
    avatar: String,
    counts: [{ type: Schema.Types.ObjectId, refs: 'Count' }]
}, {
    timestamps: true // fecha de creación y de actualización
});
module.exports = UserSchema;
