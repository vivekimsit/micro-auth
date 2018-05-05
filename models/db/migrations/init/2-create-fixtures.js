'use strict';

const Promise = require('bluebird');
const _ = require('lodash');

const fixtures = require('../../schema/fixtures');
const logger = require('../../../../web/lib/logger');
const models = require('../../../');

console.log(models);

module.exports.config = {
  transaction: true
};

module.exports.up = function insertFixtures({ connection }) {

  return Promise.mapSeries(fixtures.models, function (model) {
    logger.info('Model: ' + model.name);

    return addFixturesForModel(model);
  }).then(function () {
    return Promise.mapSeries(fixtures.relations, function (relation) {
      logger.info('Relation: ' + relation.from.model + ' to ' + relation.to.model);
      return addFixturesForRelation(relation);
    });
  });
};

function addFixturesForModel(modelFixture, options) {
    modelFixture = _.cloneDeep(modelFixture);

    return Promise.mapSeries(modelFixture.entries, function (entry) {
        console.log(modelFixture.name);
        console.log(models[modelFixture.name]);
        return models[modelFixture.name]
            .findOne(entry.id ? {id: entry.id} : entry, options)
            .then(function (found) {
              if (!found) {
                return models[modelFixture.name].add(entry, options);
              }
            });
    }).then(function (results) {
        return { expected: modelFixture.entries.length, done: _.compact(results).length };
    });
};
