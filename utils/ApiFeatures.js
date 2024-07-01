export class ApiFeatures {
    constructor(req, model) {
        this.req = req
        this.query = model.find()
    }

    filtering() {
        const queryObj = { ...this.req.query }
        const excludField = ['page', 'sort', 'limit', 'fields', 'teacher']
        excludField.forEach((el) => {
            delete queryObj[el]
        })
        //advanced filtring
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(
            /(gt|gte|lte|lt)/g,
            (matched) => `$${matched}`
        )
        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }

    sorting() {
        if (this.req.query.sort) {
            const sortBy = this.req.query.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }
        return this
    }

    limiting() {
        if (this.req.query.fields) {
            const fields = this.req.query.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        }
        return this
    }

    pagination() {
        if (this.req.query.page) {
            const page = this.req.query.page * 1 || 1
            const limit = this.req.query.limit * 1 || 100
            const skip = (page - 1) * limit
            // const numItems = this.query.countDocuments();
            // if (skip >= numItems) {
            //     throw new Error('this page do not exist');
            // }
            this.query = this.query.skip(skip).limit(limit)
            return this
        }
        return this
    }

    withTeacher() {
        if (this.req.query.teacher === 'true') {
            this.query = this.query.populate('teacher').exec()
        }
        return this
    }
}
