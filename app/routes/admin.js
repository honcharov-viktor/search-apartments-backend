const router = require('express').Router();

const admin = require('../controllers/admin');
const search = require('../controllers/search');
const apartment = require('../controllers/apartment');
const { checkAdminJwtToken } = require('../middlewares/auth');

router.post('/admin/addDefault', admin.defaultAdmin);

router.post('/admin/sign-in', admin.login);

router.get('/admin/profile/me', checkAdminJwtToken, admin.getProfile);

router.get('/admin/apartments/search', checkAdminJwtToken, search.getList);
router.get('/admin/apartments/map', checkAdminJwtToken, search.getListForMap);
router.put('/admin/apartments/:id', checkAdminJwtToken, apartment.update);
router.get('/admin/apartments/:id', checkAdminJwtToken, apartment.get);
router.put('/admin/apartments/:id/parse', checkAdminJwtToken, apartment.parse);

// TODO: implement this route
router.get('/admin/users', checkAdminJwtToken, (req, res) => res.json({
  success: true,
  payload: {
    rows: [],
    total: 0,
  },
}));

module.exports = router;
