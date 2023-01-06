import { Schema, SchemaTypes } from "mongoose";
export interface UserId extends Document{
    _id:Schema.Types.ObjectId;
    // "userId": {
    //     "_id": "63b3c9531713c62f0ad8eced",
    //     "email": "xasdsa@gmail.com"
    // },
}