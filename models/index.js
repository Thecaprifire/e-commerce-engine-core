// import models
const Product = require("./Product");
const Category = require("./Category");
const Tag = require("./Tag");
const ProductTag = require("./ProductTag");

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: "category_id",
  // alias for the association
  as: "product_name",
});

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  through: ProductTag,
  unique: false,
  // alias for the association
  as: "tags",
});

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: "tag_id",
  // alias for the association
  as: "products",
});

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: "category_id",
  // alias for the association
  as: "products",
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};