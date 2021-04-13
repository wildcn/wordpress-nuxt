const CategoryModel = require('../resource/categories/CategoryModel');

const testModel = async () => {
  const CategoryModel = await new resouce.CategoryModel(1);
  console.log("testModel -> CategoryModel", CategoryModel)
}

testModel();