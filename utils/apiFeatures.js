class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    const queryStr = JSON.stringify(queryObj);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  limitFields() {
    const fields = '-id -__v';
    this.query = this.query.select(fields);

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = 30; //this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
