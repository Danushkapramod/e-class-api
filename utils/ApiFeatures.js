const getAllItems = AsyncWrapper(async (req, res) => {
    //1)filtring
  
    const queryObj = { ...req.query };
    const excludField = ['page', 'sort', 'limit', 'fields'];
    excludField.forEach((el) => {
      delete queryObj[el];
    });
    //advanced filtring
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/(gt|gte|lte|lt)/g, (matched) => {
      return `$${matched}`;
    });
    let query = await Item.find(JSON.parse(queryStr));
  
    //2) sorting
  
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = await Item.find(JSON.parse(queryStr)).sort(sortBy);
    }
    //3)Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
  
      query = await Item.find(JSON.parse(queryStr)).select(fields);
    }
    //Pagination page and limit
    if (req.query.page) {
      const page = req.query.page * 1 || 1;
      const limit = req.query.limit * 1 || 100;
      const skip = (page - 1) * limit;
      const numItems = await Item.countDocuments();
      if (skip >= numItems) {
        throw new Error('this page do not exist');
      }
      query = await Item.find(JSON.parse(queryStr)).skip(skip).limit(limit);
    }
  
    //execute query
  
    const items = await query;
    res.status(200).json(items);
  });