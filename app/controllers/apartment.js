const { parse: parseHtml } = require('node-html-parser');

const { catchErrors } = require('../middlewares/errorHeandler');
const Apartment = require('../db/models/Apartment');
const { NotFoundError } = require('../constants/Errors');

async function get(req, res) {
  const {
    id,
  } = req.params;
  const apartment = await Apartment.findOne({ id });
  if (!apartment) {
    throw new NotFoundError();
  }

  return res.json({
    success: true,
    payload: {
      id: apartment.id,
      parsed: apartment.parsed,
      description: apartment.description,
      title: apartment.title,
      rawPrice: apartment.rawPrice,
      position: apartment.position,
      createdAt: apartment.createdAt,
      updatedAt: apartment.updatedAt,
    },
  });
}

async function save(req, res) {
  const {
    rawHtml,
    url,
  } = req.body;

  const apartment = new Apartment({
    rawHtml,
    url,
  });

  await apartment.save();

  return res.json({
    id: apartment.id,
    createdAt: apartment.createdAt,
    updatedAt: apartment.updatedAt,
  });
}

async function update(req, res) {
  const {
    position,
    parsed,
  } = req.body;
  const {
    id,
  } = req.params;
  const apartment = await Apartment.findOne({ id });
  if (!apartment) {
    throw new NotFoundError();
  }

  if (parsed !== undefined) {
    apartment.parsed = parsed;
  }
  if (position !== undefined) {
    apartment.position = position;
  }

  await apartment.save();

  return res.json({
    success: true,
  });
}

async function parse(req, res) {
  const {
    id,
  } = req.params;

  const apartment = await Apartment.findOne({ id });
  if (!apartment) {
    throw new NotFoundError();
  }

  const root = parseHtml(apartment.rawHtml);
  const titleBox = root.querySelector('.offer-titlebox');

  const [titleBoxHeader] = titleBox.childNodes.filter((node) => node.tagName === 'h1');
  const title = `${titleBoxHeader.text}`.trim();
  // console.log('title', title);
  apartment.title = title;

  const priceBox = root.querySelector('.offer-titlebox__price');
  const rawPrice = `${priceBox.text}`.trim();
  // console.log('rawPrice', rawPrice);
  apartment.rawPrice = rawPrice;

  const descriptionBox = root.querySelector('.descriptioncontent');
  // TODO: implement parse tags
  const textContentBox = descriptionBox.querySelector('#textContent');
  const description = `${textContentBox.text}`.trim();
  // console.log('description', description);
  apartment.description = description;

  apartment.parsed = true;
  await apartment.save();

  return res.json({
    success: true,
  });
}

module.exports = {
  save: catchErrors(save),
  update: catchErrors(update),
  get: catchErrors(get),
  parse: catchErrors(parse),
};
