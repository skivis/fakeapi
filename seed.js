// Run this to generate data.json
const fs      = require('fs');
const _       = require('underscore');
const Factory = require('rosie').Factory;
const faker    = require('faker');
const db      = {};

const hex = () => Math.floor(Math.random()*16777215).toString(16);

// Tables
db.products = [];
db.variants = [];
db.albums   = [];
db.images   = [];
db.users    = [];
db.todos    = [];

// Factories
Factory.define('product')
  .sequence('id')
  .attr('name', () => faker.commerce.productName())
  .attr('description', () => faker.lorem.sentences(4))
  .attr('price', () => faker.commerce.price())
  .option('color', hex())
  .attr('imageUrl', ['color'], color => `http://placehold.it/360/${color}`);

Factory.define('variant')
  .sequence('id')
  .attr('name', () => faker.commerce.color())
  .attr('description', () => faker.lorem.sentences(4))
  .attr('stock', () => faker.random.number(100));

Factory.define('album')
  .sequence('id')
  .attr('title', () => faker.lorem.sentence());

Factory.define('image')
  .sequence('id')
  .attr('title', () => faker.lorem.sentence())
  .option('color', hex())
  .attr('url', [ 'color' ], color => `http://placehold.it/600/${color}`)
  .attr('thumbnailUrl', [ 'color' ], color => `http://placehold.it/150/${color}`);

Factory.define('todo')
  .sequence('id')
  .attr('title', () => faker.lorem.sentence())
  .attr('completed', () => _.random(1) ? true : false);

Factory.define('user').sequence('id').after(user => {
  const card = faker.helpers.userCard();
  _.each(card, (value, key) => {
    user[key] = value
  });
});

Array(10).fill().map(() => {
  const user = Factory.build('user');
  db.users.push(user);

  Array(10).fill().map(() => {
    const product = Factory.build('product', {
      userId: user.id
    });
    db.products.push(product);

    Array(5).fill().map(() => {
      const variant = Factory.build('variant', {
        productId: product.id
      });
      db.variants.push(variant)
    });
  });

  Array(10).fill().map(() => {
    const album = Factory.build('album', {
      userId: user.id
    });
    db.albums.push(album);

    Array(50).fill().map(() => {
      const image = Factory.build('image', {
        albumId: album.id
      })
      db.images.push(image)
    });
  })

  Array(20).fill().map(() => {
    const todo = Factory.build('todo', {
      userId: user.id
    });
    db.todos.push(todo);
  });
});

fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
