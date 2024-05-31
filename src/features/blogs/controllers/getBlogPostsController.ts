import {Request, Response} from 'express';
import {HTTP_CODES} from "../../../settings";
import {OutputPostPaginationType} from "../../posts/input-output-types/post-types";
import {postMongoQueryRepository} from "../../posts/repository/postMongoQueryRepository";
import {BlogIdParamInputType, BlogsQueryParamsInputType} from "../input-output-types/blog-types";
import {
    SanitizedDefaultQueryParamsType,
    sanitizeDefaultQueryParams
} from "../../../common/helpers/queryParamsSanitizer";

export const getBlogPostsController = async (req: Request<BlogIdParamInputType, OutputPostPaginationType, {}, BlogsQueryParamsInputType>, res: Response<OutputPostPaginationType>) => {
    try {
        const sanitizedQuery: SanitizedDefaultQueryParamsType = sanitizeDefaultQueryParams(req.query)
        const posts: OutputPostPaginationType = await postMongoQueryRepository.findAllForOutput(sanitizedQuery, req.params.blogId)
        res.status(HTTP_CODES.OK).send(posts);
    } catch (err) {
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR)
    }
}