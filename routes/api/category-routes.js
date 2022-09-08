const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

//-------------------------------------------------------------//

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll({
    include: [ Product ]})
    .then((productData) => {
    res.json(productData);
  });
});




router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
});




router.post('/', (req, res) => {
  // create a new category
});




//tweak this
router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
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
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});





router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
