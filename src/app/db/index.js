import mongoose from "mongoose";
import env from "../env";

export function getConnection() {
    mongoose.connect(env.mongoDBURL);
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    return db;
}
