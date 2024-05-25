import {req} from "../../../helpers/req"
import {HTTP_CODES, SETTINGS} from "../../../../src/settings"
import {InputBlogType} from "../../../../src/features/blogs/input-output-types/blog-types"
import {encodeToBase64} from "../../../../src/common/helpers/auth-helpers"
import {AUTH_DATA} from "../../../../src/settings"
import {clearTestDB, closeTestDB, connectToTestDB} from "../../../test-db"
import {createBlogs} from "../../../helpers/dataset-helpers/blogsDatasets";
import {testSeeder} from "../../../testSeeder";

describe('POST /blogs', () => {
    beforeAll(async () => {
        await connectToTestDB()
    })
    afterAll(async () => {
        await closeTestDB()
    })
    beforeEach(async () => {
        await clearTestDB()
    })
    it('- POST blog unauthorized: STATUS 401', async () => {
        const newBlog = testSeeder.createBlogDTO()

        await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.FAKE_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.UNAUTHORIZED)
    })
    it('+ POST blog with correct input data: STATUS 201', async () => {
        const newBlog = testSeeder.createBlogDTO()

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.CREATED)


        expect(res.body.name).toEqual(newBlog.name)
        expect(res.body.description).toEqual(newBlog.description)
        expect(res.body.websiteUrl).toEqual(newBlog.websiteUrl)
    })
    it('- POST blog when name not passed: STATUS 400', async () => {
        const newBlog: any = {
            description: 'description1',
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'name',
                message: 'name is missing or not a string'
            }
        )
    })
    it('- POST blog when name is not a string: STATUS 400', async () => {
        const newBlog: InputBlogType = {
            name: 123 as any,
            description: 'description1',
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'name',
                message: 'name is missing or not a string'
            }
        )
    })
    it('- POST blog with incorrect name length: STATUS 400', async () => {
        const newBlog: InputBlogType = {
            name: 'name1'.repeat(5),
            description: 'description1',
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.BAD_REQUEST)


        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'name',
                message: 'name must be less than 15 characters long'
            }
        )
    })
    it('- POST blog when description not passed: STATUS 400', async () => {
        const newBlog: any = {
            name: 'name1',
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'description',
                message: 'description is missing or not a string'
            }
        )
    })
    it('- POST blog when description is not a string: STATUS 400', async () => {
        const newBlog: InputBlogType = {
            name: 'name1',
            description: 123 as any,
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'description',
                message: 'description is missing or not a string'
            }
        )
    })
    it('- POST blog with incorrect description length: STATUS 400', async () => {
        const newBlog: InputBlogType = {
            name: 'name1',
            description: 'description1'.repeat(50),
            websiteUrl: 'https://youtube.com'
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.BAD_REQUEST)


        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'description',
                message: 'description must be less than 500 characters long'
            }
        )
    })
    it('- POST blog when websiteUrl not passed: STATUS 400', async () => {
        const newBlog: any = {
            name: 'name1',
            description: 'description1',
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'websiteUrl',
                message: 'websiteUrl is missing or not a string'
            }
        )
    })
    it('- POST blog when websiteUrl is not a string: STATUS 400', async () => {
        const newBlog: InputBlogType = {
            name: 'name1',
            description: 'description1',
            websiteUrl: 123 as any
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'websiteUrl',
                message: 'websiteUrl is missing or not a string'
            }
        )
    })
    it('- POST blog with incorrect websiteUrl length: STATUS 400', async () => {
        const newBlog: InputBlogType = {
            name: 'name1',
            description: 'description1',
            websiteUrl: 'https://' + 'youtube'.repeat(20) + '.com'
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.BAD_REQUEST)


        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'websiteUrl',
                message: 'websiteUrl must be less than 100 characters long'
            }
        )
    })
    it('- POST blog with incorrect websiteUrl: STATUS 400', async () => {
        const newBlog: InputBlogType = {
            name: 'name1',
            description: 'description1',
            websiteUrl: 'http://youtube.com'
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.BAD_REQUEST)


        expect(res.body.errorsMessages[0]).toEqual(
            {
                field: 'websiteUrl',
                message: 'Invalid value'
            }
        )
    })
    it('- POST blog with incorrect data (first errors): STATUS 400', async () => {
        const newBlog: InputBlogType = {
            name: "",
            description: null as any,
            websiteUrl: 123 as any
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set('authorization', `Basic ${encodeToBase64(AUTH_DATA.ADMIN_AUTH)}`)
            .send(newBlog)
            .expect(HTTP_CODES.BAD_REQUEST)

        expect(res.body.errorsMessages).toEqual([
            {
                field: 'name',
                message: 'name is empty'
            },
            {
                field: 'description',
                message: 'description is missing or not a string'
            },
            {
                field: 'websiteUrl',
                message: 'websiteUrl is missing or not a string'
            }
        ])
    })
})