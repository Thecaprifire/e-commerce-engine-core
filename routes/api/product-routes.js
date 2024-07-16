const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
// find all products
router.get("/", async (req, res) => {
  try {
    const prodData = await Product.findAll({
      // be sure to include its associated Category and Tag data
      include: [
        { model: Category, as: "product_name" },
        { model: Tag, through: ProductTag, as: "tags" },
      ],
    });
    res.status(200).json(prodData);
  } catch (err) {
    console.error("Error in GET /api/products:", err);
    res.status(500).json(err);
  }
});

// get one product
// find a single product by its `id`
router.get("/:id", async (req, res) => {
  try {
    const prodData = await Product.findByPk(req.params.id, {
      // be sure to include its associated Category and Tag data
      include: [
        { model: Category, as: "product_name" },
        { model: Tag, through: ProductTag, as: "tags" },
      ],
    });

    if (!prodData) {
      res.status(404).json({ message: "No product found wtih this id!" });
      return;
    }

    res.status(200).json(prodData);
  } catch (err) {
    res.status(500).json(err);
  }
});

Product.belongsTo(Category);

// create new product
router.post("/", (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  if (req.body.category_id) {
    Product.create(req.body)
      .then((product) => {
        // set the category_id directly on the product instance
        product.category_id = req.body.category_id;
        return product.save();
      })
      .then(() =>
        res.status(200).json({ message: "Product created successfully" })
      )
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  } else {
    // Handle the case where category_id is missing
    res.status(400).json({ message: "category_id is required" });
  }
});

// update product
router.put("/:id", async (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        ProductTag.findAll({
          where: { product_id: req.params.id },
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// delete one product by its `id` value
router.delete("/:id", async (req, res) => {
  try {
    const productTagIds = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!productTagIds) {
      res.status(404).json({ message: "No product found with this ID!" });
      return;
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json;
  }
});

module.exports = router;