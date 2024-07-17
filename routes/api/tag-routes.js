const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const multiTagData = await Tag.findAll({
      include: [{ model: Product, through: ProductTag, as: "products" }],
    });
    res.status(200).json(multiTagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag, as: "products" }],
    });

    if (!tagData) {
      res.status(404).json({ message: "No tag found with this ID!" });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  // create a new tag
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
    // update a tag's name by its `id` value
  try {
    const updated = await Tag.update(req.body, {
      where: { id: req.params.id },
    });
    !updated[0]
      ? res.status(404).json({ message: "No tag found with this id!" })
      : res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Tag update failed" });
  }
});

router.delete("/:id", async (req, res) => {
  // delete on tag by its `id` value
  try {
    const numAffectedRows = await Tag.destroy({
      where: { id: req.params.id },
    });

    if (!numAffectedRows === 0) {
      res.status(404).json({ message: "No tag found with this ID!" });
      return;
    }

    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (err) {
    res.status(500).jso(err);
  }
});

module.exports = router;