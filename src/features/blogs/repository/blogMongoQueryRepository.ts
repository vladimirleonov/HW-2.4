import {blogCollection} from "../../../db/mongo-db"
import {BlogDBType} from "../../../db/db-types/blog-db-types"
import {BlogQueryParams, OutputBlogType} from "../../../input-output-types/blog-types"
import {ObjectId} from "mongodb"
import {SanitizedBlogQueryParamsType} from "../../../helpers/query-helper";

export const blogMongoQueryRepository = {

    async find(query: SanitizedBlogQueryParamsType): Promise<BlogDBType[]> {
        try {
             console.log(query)
            //{
            //   searchNameTerm: null,
            //   sortBy: 'createdAt',
            //   sortDirection: 'desc',
            //   pageNumber: 4,
            //   pageSize: 3
            // }
            const search = query.searchNameTerm
                ? { name : { $regex: query.searchNameTerm, $options: 'i' }}
                : {}

            const filter = {
                ...search
            }

            return await blogCollection.find(filter)
                .sort(query.sortBy, query.sortDirection)
                .skip((query.pageNumber - 1) * query.pageSize)
                .limit(query.pageSize)
                .toArray()

        } catch (err) {
            throw new Error("Failed to get blogs")
        }
    },
    async findById(id: ObjectId): Promise<BlogDBType | null> {
        try {
            return await blogCollection.findOne({_id: id})
        } catch (err) {
            throw new Error('Failed to get blog')
        }
    },
    async findAllForOutput(query: SanitizedBlogQueryParamsType): Promise<OutputBlogType[]> {
        const blogs: BlogDBType[] = await this.find(query)
        return blogs.map((blog: BlogDBType): OutputBlogType => this.mapToOutput(blog))
    },
    async findForOutputById(id: ObjectId): Promise<{ blog?: OutputBlogType, error?: string }> {
        const blog: BlogDBType | null = await this.findById(id)
        if (!blog) {
            return {error: 'Blog not found'}
        }
        return {blog: this.mapToOutput(blog)}
    },
    mapToOutput({_id, ...rest}: BlogDBType): OutputBlogType {
        return {
            ...rest,
            id: _id.toString()
        }
    }
}