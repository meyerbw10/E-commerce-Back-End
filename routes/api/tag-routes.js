const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

//-------------------------------------------------------------//


// find all tags
router.get('/', (req, res) => {
  Tag.findAll({
    include: [ {model: Product , through: ProductTag} ]})
    .then((tagData) => {
    res.json(tagData);
  });
});



// get one tag
router.get('/:id', (req, res) => {
  Tag.findOne({
    where: {
      id: req.params.id
    },
    include: [{ model: Product , through: ProductTag }]})
    .then((tagData) => {
    res.json(tagData);
  });
});




router.post('/', (req, res) => {
  Tag.create(req.body)
    .then((tag) => res.status(200).json(tag))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});




//tweak this
router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((tag) => res.json(tag))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});




router.delete('/:id', (req, res) => {

  Tag.destroy({
      where: {
        id: req.params.id
      },
     })
    .then((tag) => res.status(200).json(tag))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

module.exports = router;
