
const router = require('express').Router();
const apartment = require('../controllers/apartment');
const search = require('../controllers/search');

router.get('/', (req, res) => res.json({ test: true }));

router.get('/apartment/:id', apartment.get);
router.post('/apartment', apartment.save);

router.post('/search', search.getByUrl);

module.exports = router;
