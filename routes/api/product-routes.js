const router = require("express").Router();
const { Router } = require("express");
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products, including associated category and tag data
router.get("/", async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [
        { model: Category, attributes: ["id", "category_name"] },
        {
          model: Tag,
          through: ProductTag,
          as: "product_tags",
          attributes: ["id", "tag_name"],
        },
      ],
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product by ID, including associated category and tag data
router.get("/:id", async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, attributes: ["id", "category_name"] },
        {
          model: Tag,
          through: ProductTag,
          as: "product_tags",
          attributes: ["id", "tag_name"],
        },
      ],
    });
    if (!productData) {
      res.status(404).json({ message: "Product not found!" });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post("/", async (req, res) => {
  try {
    const product = await Product.create({
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      category_id: req.body.category_id,
      tagIds: req.body.tagIds,
    });

    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds.length) {
      //if (req.body.tagIds) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });

      const productTagIds = await ProductTag.bulkCreate(productTagIdArr);
      return res.status(200).json(productTagIds);
    }
    // if no product tags, just respond
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

//update product
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.update(
      {
        product_name: req.body.product_name,
        price: req.body.price,
        stock: req.body.stock,
        category_id: req.body.category_id,
        tagIds: req.body.tagIds,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    // find all associated tags from ProductTag
    const productTags = await ProductTag.findAll({
      where: { product_id: req.params.id },
    });
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    // create filtered list of new tag_ids
    const newProductTags = req.body.tagIds
      .filter((tag_id) => {
        !productTagIds.includes(tag_id);
      })
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
    //create new tags, delete redundant ones
    const newTags = [
      await ProductTag.bulkCreate(newProductTags),
      await ProductTag.destroy({ where: { id: productTagsToRemove } }),
    ];
    return res.status(200).json(newTags);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// delete one product by its `id` value
router.delete("/:id", async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!productData) {
      res.status(404).json({ message: "Product not found!" });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
