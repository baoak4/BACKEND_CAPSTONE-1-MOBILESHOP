class BaseService {
    static DEFAULT_PAGE = 1;
    static DEFAULT_LIMIT = 10;
    static MAX_LIMIT = 100;

    static parsePagination(query = {}) {
        const page = Math.max(1, parseInt(query.page, 10) || this.DEFAULT_PAGE);
        const limit = Math.min(
            this.MAX_LIMIT,
            Math.max(1, parseInt(query.limit, 10) || this.DEFAULT_LIMIT)
        );
        const skip = (page - 1) * limit;
        return { page, limit, skip };
    }

    static parseSortDirection(value) {
        if (value == null) return null;
        const num = parseInt(value, 10);
        return num === -1 || num === 1 ? num : null;
    }

    static async findPaginated(Model, filter, sort, { page, limit, skip }, options = {}) {
        const paginationResult = (data, total) => ({
            data,
            pagination: { total, page, limit, totalPages: Math.ceil(total / limit) || 0 },
        });

        if (options.lookup) {
            const pipe = [
                { $match: filter },
                { $sort: sort },
                { $skip: skip },
                { $limit: limit },
                { $lookup: options.lookup },
            ];
            const [data, total] = await Promise.all([
                Model.aggregate(pipe).exec(),
                Model.countDocuments(filter),
            ]);
            return paginationResult(data, total);
        }

        let query = Model.find(filter).sort(sort).skip(skip).limit(limit);
        if (options.populate) query = query.populate(options.populate);
        const [data, total] = await Promise.all([
            query.lean(),
            Model.countDocuments(filter),
        ]);
        return paginationResult(data, total);
    }
}

module.exports = BaseService;
