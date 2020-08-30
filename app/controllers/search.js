const { catchErrors } = require('../middlewares/errorHeandler');
const Apartment = require('../db/models/Apartment');

async function getByUrl(req, res) {
  const {
    url,
  } = req.body;
  const apartment = await Apartment.findOne({ url }).select('id createdAt updatedAt');
  if (!apartment) {
    return res.json({
      notFound: true,
    });
  }

  return res.json(apartment);
}

async function getList(req, res) {
  const {
    page,
    perPage,
  } = req.query;

  const apartments = await Apartment.find()
    .skip((+page - 1) * +perPage)
    .limit(+perPage)
    .select('id parsed position createdAt updatedAt');
  const total = await Apartment.countDocuments();

  return res.json({
    success: true,
    payload: {
      rows: apartments,
      total,
    },
  });
}

async function getListForMap(req, res) {
  const where = {position: { $exists: true, $ne: null }};
  const apartments = await Apartment.find(where)
    .select('id position');
  const total = await Apartment.countDocuments(where);

  return res.json({
    success: true,
    payload: {
      rows: apartments,
      total,
    },
  });
}

module.exports = {
  getByUrl: catchErrors(getByUrl),
  getList: catchErrors(getList),
  getListForMap: catchErrors(getListForMap),
};
