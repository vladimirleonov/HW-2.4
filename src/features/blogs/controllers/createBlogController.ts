import {Request, Response} from 'express'
import {BlogBodyInputType, BlogOutputType} from '../input-output-types/blog-types'
import {HTTP_CODES} from '../../../settings'
import {blogService} from "../services/blogService";
import {blogMongoQueryRepository} from "../repository/blogMongoQueryRepository";
import {Result} from "../../../common/types/result-type";

export const createBlogController = async (req: Request<{}, BlogOutputType, BlogBodyInputType>, res: Response<BlogOutputType>) => {
    try {
        const result: Result<string> = await blogService.createBlog(req.body)

        const blog: BlogOutputType | null = await blogMongoQueryRepository.findForOutputById(result.data)

        //? !
        res.status(HTTP_CODES.CREATED).send(blog!);
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}