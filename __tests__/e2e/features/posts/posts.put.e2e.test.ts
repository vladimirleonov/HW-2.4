import {req} from "../../../helpers/req"
import {AUTH_DATA, HTTP_CODES, SETTINGS} from "../../../../src/settings"
import {InputPostType, OutputPostType} from "../../../../src/features/posts/input-output-types/post-types"
import {encodeToBase64} from "../../../../src/common/helpers/auth-helpers"
import {createBlogs} from "../../../helpers/dataset-helpers/blogsDatasets"
import {createPosts} from "../../../helpers/dataset-helpers/postsDatasets"
import {clearTestDB, connectToTestDB, closeTestDB} from "../../../test-db"
import {OutputBlogType} from "../../../../src/features/blogs/input-output-types/blog-types";

describe('PUT /posts', () => {
    beforeAll(async () => {
        await connectToTestDB()
    })
    afterAll(async () => {
        await closeTestDB()
    })
    beforeEach(async () => {
        await clearTestDB()
    })
    it('- PUT posts unauthorized: STATUS 401', async () => {
        const blogs: OutputBlogType[] = await createBlogs()
        const posts: OutputPostType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id.toString()

        const postForUpdating: InputPostType = {
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('+ PUT posts with correct input data: STATUS 204', async () => {
        const blogs: OutputBlogType[] = await createBlogs()
        const posts: OutputPostType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id.toString()

        const postForUpdating: InputPostType = {
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.NO_CONTENT)
    })
    it('- PUT posts when title not passed', async () => {
        const blogs: OutputBlogType[] = await createBlogs()
        const posts: OutputPostType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id.toString()

        const postForUpdating: any = {
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'title',
                message: 'title is missing or not a string'
            }
        )
    })
    it('- PUT posts when title is not a string: STATUS 400', async () => {
        const blogs: OutputBlogType[] = await createBlogs()
        const posts: OutputPostType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id.toString()

        const postForUpdating: InputPostType = {
            title: 123 as any,
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'title',
                message: 'title is missing or not a string'
            }
        )
    })
    it('- PUT posts when title is too long: STATUS 400', async () => {
        const blogs: OutputBlogType[] = await createBlogs()
        const posts: OutputPostType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id.toString()

        const postForUpdating: InputPostType = {
            title: 'title2'.repeat(10),
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'title',
                message: 'title must be less than 30 characters long'
            }
        )
    })
    it('- PUT posts when shortDescription not passed: STATUS 400', async () => {
        const blogs: OutputBlogType[] = await createBlogs()
        const posts: OutputPostType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id.toString()

        const postForUpdating: any = {
            title: "title2",
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'shortDescription',
                message: 'shortDescription is missing or not a string'
            }
        )
    })
    it('- PUT posts when shortDescription is not a string: STATUS 400', async () => {
        const blogs: OutputBlogType[] = await createBlogs()
        const posts: OutputPostType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id.toString()

        const postForUpdating: InputPostType = {
            title: "title2",
            shortDescription: 123 as any,
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'shortDescription',
                message: 'shortDescription is missing or not a string'
            }
        )
    })
    it('- PUT posts when shortDescription is too long: STATUS 400', async () => {
        const blogs: OutputBlogType[] = await createBlogs()
        const posts: OutputPostType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id.toString()

        const postForUpdating: InputPostType = {
            title: 'title2',
            shortDescription: 'shortDescription2'.repeat(10),
            content: 'content2',
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'shortDescription',
                message: 'shortDescription must be less than 100 characters long'
            }
        )
    })
    it('- PUT posts when content not passed: STATUS 400', async () => {
        const blogs: OutputBlogType[] = await createBlogs()
        const posts: OutputPostType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id.toString()

        const postForUpdating: any = {
            title: "title2",
            shortDescription: "shortDescription2",
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'content',
                message: 'content is missing or not a string'
            }
        )
    })
    it('- PUT posts when content is not a string: STATUS 400', async () => {
        const blogs: OutputBlogType[] = await createBlogs()
        const posts: OutputPostType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id.toString()

        const postForUpdating: InputPostType = {
            title: "title2",
            shortDescription: "shortDescription2",
            content: 123 as any,
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'content',
                message: 'content is missing or not a string'
            }
        )
    })
    it('- PUT posts when content is too long: STATUS 400', async () => {
        const blogs: OutputBlogType[] = await createBlogs()
        const posts: OutputPostType[] = await createPosts(blogs)

        const blogId: string = blogs[0].id.toString()

        const postForUpdating: InputPostType = {
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2'.repeat(130),
            blogId: blogId
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'content',
                message: 'content must be less than 1000 characters long'
            }
        )
    })
    it('- PUT posts when blogId not passed: STATUS 400', async () => {
        const blogs: OutputBlogType[] = await createBlogs()
        const posts: OutputPostType[] = await createPosts(blogs)

        const postForUpdating: any = {
            title: "title2",
            shortDescription: "shortDescription2",
            content: "content2",
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'blogId',
                message: 'blogId is missing or not a string'
            }
        )
    })
    it('- PUT posts when blogId is not a string: STATUS 400', async () => {
        const blogs: OutputBlogType[] = await createBlogs()
        const posts: OutputPostType[] = await createPosts(blogs)

        const postForUpdating: InputPostType = {
            title: "title2",
            shortDescription: "shortDescription2",
            content: "content2",
            blogId: 123 as any
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'blogId',
                message: 'blogId is missing or not a string'
            }
        )
    })
    it('- PUT posts when blogId is invalid: STATUS 400', async () => {
        const blogs: OutputBlogType[] = await createBlogs()
        const posts: OutputPostType[] = await createPosts(blogs)

        const postForUpdating: InputPostType = {
            title: 'title2',
            shortDescription: 'shortDescription2',
            content: 'content2',
            blogId: '-123'
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'blogId',
                message: 'invalid blogId!'
            }
        )
    })
    it('- PUT posts with incorrect data (first errors): STATUS 400', async () => {
        const blogs: OutputBlogType[] = await createBlogs()
        const posts: OutputPostType[] = await createPosts(blogs)

        const postForUpdating: InputPostType = {
            title: "",
            shortDescription: 123 as any,
            content: 123 as any,
            blogId: 123 as any
        }

        const res = await req
            .put(`${SETTINGS.PATH.POSTS}/${posts[0].id}`)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(postForUpdating)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages).toEqual([
            {
                field: 'title',
                message: 'title is empty'
            },
            {
                field: 'shortDescription',
                message: 'shortDescription is missing or not a string'
            },
            {
                field: 'content',
                message: 'content is missing or not a string'
            },
            {
                field: 'blogId',
                message: 'blogId is missing or not a string'
            }
        ])
    })
})