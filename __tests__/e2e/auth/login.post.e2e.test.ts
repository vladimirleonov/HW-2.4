import {req} from "../../helpers/req"
import {AUTH_DATA, SETTINGS} from "../../../src/settings"
import {HTTP_CODES} from "../../../src/settings"
import {createBlogs} from '../../helpers/blog-helpers'
import {ObjectId} from "mongodb"
import {BlogOutputType} from "../../../src/features/blogs/input-output-types/blog-types";
import {createPosts} from "../../helpers/post-helpers";
import {PostOutputType} from "../../../src/features/posts/input-output-types/post-types";
import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../../src/db/mongo-db";
import {LoginInputType, LoginOutputType} from "../../../src/features/auth/input-output-types/auth-types";
import {loginUser} from "../../helpers/auth-helpers";
import {base64Service} from "../../../src/common/adapters/base64Service";
import {UserBodyInputType} from "../../../src/features/users/input-output-types/user-types";

describe('AUTH /login', () => {
    beforeAll(async () => {
        const mongoServer: MongoMemoryServer = await MongoMemoryServer.create()
        await db.run(mongoServer.getUri())
    })
    afterAll(async () => {
        await db.stop()
    })
    beforeEach(async () => {
        await db.drop()
    })
    it('+ POST login user: STATUS 200', async () => {
        await loginUser()
    })
    it('- POST loginOrEmail not passed : STATUS 400', async () => {
        const loginRes = await req.post(`${SETTINGS.PATH.AUTH}/login`)
            .send({
                password: 'test1234'
            }).expect(HTTP_CODES.BAD_REQUEST)

        expect(loginRes.body.errorsMessages[0]).toEqual({
            message: 'loginOrEmail is missing or not a string',
            field: 'loginOrEmail'
        })
    })
    it('- POST password is empty : STATUS 400', async () => {
        const loginRes = await req.post(`${SETTINGS.PATH.AUTH}/login`)
            .send({
                loginOrEmail: 'test1234',
                password: ''
            }).expect(HTTP_CODES.BAD_REQUEST)

        expect(loginRes.body.errorsMessages[0]).toEqual({
            message: 'password is required',
            field: 'password'
        })
    })
})