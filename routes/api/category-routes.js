const router = require('express').Router();
const { Category, Product, ProductTag } = require('../../models');

// The `/api/categories` endpoint

//-------------------------------------------------------------//


//get all categories
router.get('/', (req, res) => {
  Category.findAll({
    include: [{ model: Product }]})
    .then((catData) => {
    res.json(catData);
  });
});



// get one Category
router.get('/:id', (req, res) => {
  Category.findOne({
    where: {
      id: req.params.id
    },
    include: [{ model: Product }]})
    .then((catData) => {
    res.json(catData);
  });
});



router.post('/', (req, res) => {
 
  Category.create(req.body)
    .then((category) => {
      if (req.body.tagIds.length) {
        // need help here
        const categoryTagIdArr = req.body.category_id.map((category_id) => {
          return {
            category_id: category.id,
          };
        });
        return ProductTag.bulkCreate(categoryTagIdArr);
      }
      res.status(200).json(category);
    })
    .then((categoryTagIds) => res.status(200).json(categoryTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});



//tweak this
router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((category) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { category_id: req.params.id } });
    })
    .then((categoryTags) => {
      // get list of current tag_ids
      const categoryTagIds = categoryTags.map(({ id }) => id);
      // create filtered list of new tag_ids
      const newCategoryTags = req.body.tagIds
        .filter((id) => !categoryTagIds.includes(id))
        .map((category_id) => {
          return {
            category_id: category_id
          };
        });
      // figure out which ones to remove
      const categoryTagsToRemove = categoryTags
        .filter(({ id }) => !req.body.id.includes(id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: categoryTagsToRemove } }),
        ProductTag.bulkCreate(newCategoryTags),
      ]);
    })
    .then((updatedCatTags) => res.json(updatedCatTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});





router.delete('/:id', (req, res) => {

  Category.destroy({
      where: {
        id: id
      },
     })

    .then((category) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.id.length) {
        const categoryTagIdArr = req.body.id.map((id) => {
          return {
            category_id: category_id
          };
        });
        return Category.bulkCreate(categoryTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(category);
    })
    .then((productCatagoryIds) => res.status(200).json(productCatagoryIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

module.exports = router;
