import {req} from "../../../helpers/req"
import {AUTH_DATA, HTTP_CODES, SETTINGS} from "../../../../src/settings"
import {encodeToBase64} from "../../../../src/common/helpers/auth-helpers"
import {createBlogs} from "../../../helpers/dataset-helpers/blogsDatasets"
import {createPosts} from "../../../helpers/dataset-helpers/postsDatasets"
import {clearTestDB, connectToTestDB, closeTestDB} from "../../../test-db"
import {ObjectId} from "mongodb"
import {OutputBlogType} from "../../../../src/features/blogs/input-output-types/blog-types";
import {OutputPostType} from "../../../../src/features/posts/input-output-types/post-types";

describe('DELETE /posts', () => {
    beforeAll(async () => {
        await connectToTestDB()
    })
    afterAll(async () => {
        await closeTestDB()
    })
    beforeEach(async () => {
        await clearTestDB()
    })
    it('- DELETE posts unauthorized: STATUS 401', async () => {
        const blogs: OutputBlogType[] = await createBlogs()
        const posts: OutputPostType[] = await createPosts(blogs)

        await req
            .delete(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('- DELETE posts with incorrect input id: STATUS 404', async () => {
        const blogs: OutputBlogType[] = await createBlogs()
        const posts: OutputPostType[] = await createPosts(blogs)

        await req
            .delete(`${SETTINGS.PATH.POSTS}/${new ObjectId()}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .expect(HTTP_CODES.NOT_FOUND)
    })
    it('+ DELETE posts with correct input data: STATUS 204', async () => {
        const blogs: OutputBlogType[] = await createBlogs()
        const posts: OutputPostType[] = await createPosts(blogs)

        await req
            .delete(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .expect(HTTP_CODES.NO_CONTENT)
    })
})