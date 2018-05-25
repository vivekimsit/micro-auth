'use strict';

const bookshelf = require('bookshelf');
const uuidv4 = require('uuid/v4');

const { connection } = require('../db');

const Bookshelf = bookshelf(connection);
Bookshelf.plugin('registry');

Bookshelf.Model = Bookshelf.Model.extend(
  {
    // Bookshelf `hasTimestamps` - handles created_at and updated_at properties
    hasTimestamps: true,
    idAttribute: 'uid',

    initialize: function initialize() {
      this.on('saving', this.onSaving);
      this.on('fetching', this.onFetching);
      this.on('creating', this.onCreating);
      this.on('created', this.onCreated);
      this.on('updating', this.onUpdating);
      this.on('updated', this.onUpdated);
    },

    emitChange: function emitChange(model, event, options = {}) {
      events.emit(event, model, options);
    },

    onSaving: function onSaving(newObj, attrs, options) {
      //console.log('On Saving');
    },

    onFetching: function onFetching(model, columns, options) {
      //console.log('On fetching');
    },

    onCreating: function onCreating(newObj, attr, options = {}) {
      //console.log('On Creating');
      if (options.importing || options.internal) {
        this.set('created_by', Bookshelf.Model.internalUser);
      }
    },

    onCreated: function onCreated(newObj, newId, options) {
      //console.log('On Created');
    },

    onUpdating: function onUpdating(newObj, attr, options) {
      //console.log('On Updating');
    },

    onUpdated: function onUpdated(newObj, affectedRows, options) {
      //console.log('On Updated');
    },
  },
  {
    internalUser: '1',
    /**
     * Select a collection based on a query
     * @param {Object} [query]
     * @param {Object} [options] Options used of model.fetchAll
     * @return {Promise(bookshelf.Collection)} Bookshelf Collection of Models
     */
    findAll: async function(filter, options) {
      return this.forge()
        .where(filter)
        .fetchAll(options);
    },

    /**
     * Find a model based on it's ID
     * @param {String} id The model's ID
     * @param {Object} [options] Options used of model.fetch
     * @return {Promise(bookshelf.Model)}
     */
    findById: async function(id, options) {
      return this.findOne({ [this.prototype.idAttribute]: id }, options);
    },

    /**
     * Select a model based on a query
     * @param {Object} [query]
     * @param {Object} [options] Options for model.fetch
     * @param {Boolean} [options.require=false]
     * @return {Promise(bookshelf.Model)}
     */
    findOne: async function(query, options) {
      return this.forge(query).fetch(options);
    },

    /**
     * Insert a model based on data
     * @param {Object} data
     * @param {Object} [options] Options for model.save
     * @return {Promise(bookshelf.Model)}
     */
    create: async function(data, options) {
      options = options || {};
      //https://stackoverflow.com/a/31449937
      options.method = 'insert';
      return this.forge(data).save(null, options);
    },

    /**
     * Update a model based on data
     * @param {Object} data
     * @param {Object} options Options for model.fetch and model.save
     * @param {String|Integer} options.id The id of the model to update
     * @param {Boolean} [options.patch=true]
     * @param {Boolean} [options.require=true]
     * @return {Promise(bookshelf.Model)}
     */
    update: async function(data, options) {
      return this.forge({ [this.prototype.idAttribute]: options.id })
        .fetch(options)
        .then(function(model) {
          return model ? model.save(data, options) : undefined;
        });
    },
  }
);

module.exports = Bookshelf;
