export class ApiFeatures {
    constructor(req, model) {
        this.req = req
        this.query = model.find()
    }

    filtering() {
        const queryObj = { ...this.req.query }
        const excludField = ['page', 'sort', 'limit', 'fields', 'teacher','search','field']
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

    searching() {
        if (this.req.query.search) {
            const query = { [this.req.query.field || 'name']: { $regex: this.req.query.search, $options: "i" } };
            this.query = this.query.find(query)
        }
        return this
    }

    pagination() {
        if (this.req.query.page) {
            const page = this.req.query.page * 1 || 1
            const limit = this.req.query.limit * 1 || 100
            const skip = (page - 1) * limit
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
