import {db} from "../../../db/mongo-db";
import {InsertOneResult, ObjectId} from "mongodb";
import {RevokedTokenDbType} from "../../../db/db-types/refreshToken-db-types";

export const revokedTokenRepository = {
    async create (token: string, userId: string): Promise<string> {
        const insertedInfo: InsertOneResult<RevokedTokenDbType> = await db.getCollections().revokedTokensCollection.insertOne({
            userId: new ObjectId(userId),
            token: token,
        })
        console.log(insertedInfo.insertedId.toString())
        return insertedInfo.insertedId.toString()
    },
    async findByToken (token: string): Promise<RevokedTokenDbType | null> {
        return db.getCollections().revokedTokensCollection.findOne({token})
    }
}