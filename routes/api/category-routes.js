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
    .then((category) => res.status(200).json(category))
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
    .then((updatedCategory) => res.json(updatedCategory))
    .catch((err) => {
     
      res.status(400).json(err);
    });
});





router.delete('/:id', (req, res) => {

  Category.destroy({
      where: {
        id: req.params.id
      },
     })
    .then((category) => res.status(200).json(category))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

module.exports = router;
