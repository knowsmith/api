class QueryBuilder {
    constructor(model, query, options) {
        this.model = model;
        this.query = query;
        this.excludedParams = ['page', 'sort', 'limit', 'fields'];
        this.dbQuery = this.model.find();
        if (options.setExcludedParams) {
            options.setExcludedParams.forEach((el) => {
                this.excludedParams.push(el);
            });
        }
    }

    filter() {
        let query = { ...this.query };
        this.excludedParams.forEach((el) => delete query[el]);
        query = JSON.parse(
            JSON.stringify(query).replace(
                /\b(gte|gt|lte|lt)\b/g,
                (match) => `$${match}`
            )
        );
        this.dbQuery = this.dbQuery.find(query);

        return this;
    }

    limitFields() {
        if (this.query.fields) {
            const fields = this.query.fields.split(',').join(' ');
            this.dbQuery = this.dbQuery.select(fields);
        } else {
            this.dbQuery = this.dbQuery.select('-__v');
        }

        return this;
    }

    sort() {
        if (this.query.sort) {
            const fields = this.query.sort.split(',').join(' ');
            this.dbQuery = this.dbQuery.sort(fields);
        } else {
            const fields = '-createdAt';
            this.dbQuery = this.dbQuery.sort(fields);
        }

        return this;
    }

    paginate() {
        if (this.query.page && this.query.limit) {
            const limit = this.query.limit * 1 || 10;
            const page = this.query.page * 1 || 1;
            const skip = (page - 1) * limit;
            this.dbQuery = this.dbQuery.skip(skip).limit(limit);
        }

        return this;
    }
}

module.exports = QueryBuilder;
