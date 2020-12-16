const debug = require('debug')('app:database');
const config = require('config');
const { MongoClient, ObjectID } = require('mongodb');
const moment = require('moment');
const { date } = require('joi');

let _database = null;

const connect = async () => {
  if (!_database) {
    const dbUrl = config.get('db.url');
    const dbName = config.get('db.name');
    const poolSize = config.get('db.poolSize');
    const client = await MongoClient.connect(dbUrl, {
      useUnifiedTopology: true,
      poolSize: poolSize,
    });
    _database = client.db(dbName);
  }
  return _database;
};

const addUser = async (data) => {
  const database = await connect();
  return database.collection('users').insertOne(data);
};
const addPost = async (data) => {
  debug(data)
  const database = await connect();
  return database.collection('posts').insertOne(data);
};

const deleteUser = async (id) => {
  const database = await connect();
  return database.collection('users').deleteOne({ _id: new ObjectID(id) });
};
const deletePost = async (username) => {
  const database = await connect();
  return database.collection('posts').deleteOne({ username: username });
};

const updateUser = async (data) => {
  const database = await connect();
  return database.collection('users').updateOne(
    {
      _id: new ObjectID(data.id),
    },
    {
      $set: data,
    }
  );
};
const updatePost = async (data) => {
  const database = await connect();
  return database.collection('posts').updateOne(
    {
      _id: new ObjectID(data.id),
    },
    {
      $set: data,
    }
  );
};

const getUserByName = async (username) => {
  const database = await connect();
  return database.collection('users').findOne({ username: username });
};
const getUserByEmail = async (email) => {
  const database = await connect();
  return database.collection('users').findOne({ email });
};
const getUserById = async (id) => {
  const database = await connect();
  return database.collection('users').findOne({ _id: new ObjectID(id) });
};
const getPostByName = async (username) => {
  debug(username)
  const database = await connect();
  return database.collection('posts').aggregate([{$match: {username: username} }]).toArray();
};
const getAllPost = async (pipeline) => {
  const database = await connect();
  return database.collection('posts').aggregate(pipeline).toArray();
};
module.exports = {
  connect,
  getAllPost,
  addPost,
  addUser,
  updatePost,
  updateUser,
  deletePost,
  deleteUser,
  getPostByName,
  getUserByName,
  getUserById,
  getUserByEmail,
};
