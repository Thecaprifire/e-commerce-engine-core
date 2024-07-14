const { Category } = require('../models');

const categoryData = [
  {
    name: 'Shirts',
  },
  {
    name: 'Shorts',
  },
  {
    name: 'Music',
  },
  {
    name: 'Hats',
  },
  {
    name: 'Shoes',
  },
];

const seedCategories = async () => {
  await Category.bulkCreate(categoryData);
};

module.exports = seedCategories;