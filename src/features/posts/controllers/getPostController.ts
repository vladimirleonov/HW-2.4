import {Request, Response} from 'express'
import {PostOutputType} from '../input-output-types/post-types'
import {HTTP_CODES} from '../../../settings'
import {IdParamInputType} from "../../../common/input-output-types/common-types";
import {postMongoQueryRepository} from "../repository/postMongoQueryRepository";

export const getPostController = async (req: Request<IdParamInputType, PostOutputType>, res: Response<PostOutputType>) => {
    try {
        const foundInfo = await postMongoQueryRepository.findForOutputById(req.params.id)

        if (foundInfo.error) {
            res.status(HTTP_CODES.NOT_FOUND).send()
            return
        }

        res.status(HTTP_CODES.OK).send(foundInfo.post)
    } catch (err) {
        console.error(err)
        res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send()
    }
}