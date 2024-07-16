const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

// find all categories
router.get("/", async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      // be sure to include its associated Products
      include: [{ model: Product, as: "products" }],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// find one category by its `id` value
router.get("/:id", async (req, res) => {
  try {
    const catID = await Category.findByPk(req.params.id, {
      // be sure to include its associated Products
      include: [{ model: Product, as: "products" }],
    });

    if (!catID) {
      res.status(404).json({ message: "No category found with this ID!" });
      return;
    }

    res.status(200).json(catID);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create a new category
router.post("/", async (req, res) => {
  try {
    const catID = await Category.create(req.body);
    res.status(200).json(catID);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update a category by its `id` value
router.put("/:id", async (req, res) => {
  try {
    const catID = await Category.update(req.body, {
      where: { id: req.params.id },
    });

    if (!catID[0]) {
      res.status(404).json({ message: "No category found with this id!" });
      return;
    }

    res.status(200).json({ message: "Category updated successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a category by its `id` value
router.delete("/:id", async (req, res) => {
  try {
    const catID = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!catID) {
      res.status(404).json({ message: "No category found with this ID!" });
      return;
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;