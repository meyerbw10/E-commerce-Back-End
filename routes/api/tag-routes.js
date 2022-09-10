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
  Product.create(req.body)
    .then((tag) => {
      if (req.body.id.length) {
        const tagIdArr = req.body.id.map((id) => {
          return {
            id: req.params.id ,
            tag_name,
          };
        });
        return Tag.bulkCreate(tagIdArr);
      }
      res.status(200).json(tag);
    })
    .then((tagIds) => res.status(200).json(tagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});




//tweak this
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((tag) => {
      return Tag.findAll({ where: { tag_name: req.params.id } });
    })
    .then((tagsz) => {
      const tagIds = tagsz.map(({ tag_name }) => tag_name);
      const newtags = req.body.tag_name
        .filter((tag_name) => !tagIds.includes(tag_name))
        .map((tag_name) => {
          return {
            id: req.params.id ,
            tag_name,
          };
        });

      const tagsToRemove = tagsz
        .filter(({ tag_name }) => !req.body.id.includes(id))
        .map(({ id }) => id);

      return Promise.all([
        ProductTag.destroy({ where: { id: tagsToRemove } }),
        ProductTag.bulkCreate(newtags),
      ]);
    })
    .then((updatedtags) => res.json(updatedtags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});




router.delete('/:id', (req, res) => {

  Product.destroy({
      where: {
        id: req.params.id
      },
     })

    .then((tag) => {
      if (req.body.id.length) {
        const tagIdArr = req.body.id.map((id) => {
          return {
            id: req.params.id ,
            tag_name,
          };
        });
        return Tag.bulkCreate(tagIdArr);
      }
      res.status(200).json(tag);
    })
    .then((tagIds) => res.status(200).json(tagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

module.exports = router;
