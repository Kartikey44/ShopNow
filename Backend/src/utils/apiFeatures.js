class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Search
  search() {
    if (this.queryString.keyword) {
      const keyword = {
        productName: {
          $regex: this.queryString.keyword,
          $options: "i",
        },
      };

      this.query = this.query.find(keyword);
    }

    return this;
  }

  // Filter
  filter() {
    const queryCopy = { ...this.queryString };

    // Remove special fields
    const removeFields = ["keyword", "page", "limit", "sort", "fields"];

    removeFields.forEach((field) => delete queryCopy[field]);

    // Convert gte, gt, lte, lt into MongoDB operators
    let queryStr = JSON.stringify(queryCopy);

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`,
    );

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  // Sorting
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  // Field Selection
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  // Pagination
  // Pagination
  pagination() {
    const resultPerPage = Number(this.queryString.limit) || 10;
    const currentPage = Number(this.queryString.page) || 1;

    const offset = resultPerPage * (currentPage - 1);

    this.query = this.query.skip(offset).limit(resultPerPage);

    this.paginationData = {
      resultPerPage,
      currentPage,
      offset,
    };

    return this;
  }
}

export default ApiFeatures;