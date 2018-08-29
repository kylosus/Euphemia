// const MongoClient = require('mongodb').MongoClient;
// let database;
// MongoClient.connect(process.env.DATABASE_URL, { useNewUrlParser: true }).then(db => {
//     database = db.db('test');
//     console.log(database);
// }).catch(error => {
//     throw `Failed connecting to database\n${error}`;
// });
// console.log('hmm');
//
// module.getField = (id, collection, field) => {
//     return database.collection(collection).findOne({_id: id}, {projection: {field: 1, _id: 0}});
// };
