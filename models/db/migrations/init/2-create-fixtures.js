'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const uuidv4 = require('uuid/v4');

const fixtures = require('../../schema/fixtures');
const logger = require('../../../../web/lib/logger');
const models = require('../../../');

module.exports.config = {
  transaction: true,
};

module.exports.up = async function insertFixtures({ connection }) {
  const { models, relations } = fixtures;
  await Promise.mapSeries(models, model => {
    logger.info('Model: ' + model.name);
    return addFixturesForModel(model);
  });
  await Promise.mapSeries(relations || [], relation => {
    logger.info(
      'Relation: ' + relation.from.model + ' to ' + relation.to.model
    );
    return addFixturesForRelation(relation);
  });
};

function addFixturesForModel(modelFixture, options) {
  options = Object.assign(
    {
      importing: true,
      internal: true,
    },
    options
  );

  modelFixture = _.cloneDeep(modelFixture);

  return Promise.mapSeries(modelFixture.entries, function(entry) {
    return models[modelFixture.name]
      .findOne(entry.id ? { id: entry.id } : entry, options)
      .then(function(found) {
        if (!found) {
          return models[modelFixture.name].create(entry, options);
        }
      });
  }).then(function(results) {
    return {
      expected: modelFixture.entries.length,
      done: _.compact(results).length,
    };
  });
}

/**
 *
 *  fixture {
 *    from: { model, match, relation },
 *    to: { model, match },
 *    entries: {...}
 *  }
 *
 *  entry: {
 *    key: value
 *  }
 *
 */
async function addFixturesForRelation(relationFixture, options) {
  const ops = [];
  const { from, to, entries } = relationFixture;
  const { relation } = from;

  // fetch all data from both relations
  const data = await fetchRelationData(relationFixture, options);
  const { fromValues, toValues } = data;

  let max = 0;
  _.each(entries, (entry, key) => {
    const fromItem = fromValues.find(
      matchFunc(relationFixture.from.match, key)
    );
    if (!fromItem) {
      logger.warn(
        `Skip: Target database entry not found for model: ${
          from.model
        } key: ${key}`
      );
      return Promise.resolve();
    }
    _.each(entry, (value, key) => {
      let toItems = toValues.filter(
        matchFunc(relationFixture.to.match, key, value)
      );
      max += toItems.length;
      toItems = dedup(to.match, fromItem.related(relation), toItems);

      ops.push(function addRelationItems() {
        return attach(
          models[from.model],
          fromItem.get('uid'),
          relation,
          toItems,
          options
        );
      });
    });
  });
  const results = Promise.reduce(
    ops,
    function(accumulator, task) {
      const result = task.apply(this);
      accumulator.push(result);
      return accumulator;
    },
    []
  );
  return {
    expected: max,
    done: _(results)
      .map('length')
      .sum(),
  };
}

function attach(Model, effectedModelId, relation, modelsToAttach, options) {
  let fetchedModel;
  options = options || {};

  return Model.forge({ uid: effectedModelId })
    .fetch(options)
    .then(function successFetchedModel(_fetchedModel) {
      fetchedModel = _fetchedModel;
      if (!fetchedModel) {
        throw new Error({ level: 'critical', help: effectedModelId });
      }

      return Promise.resolve(modelsToAttach).then(function then(models) {
        return fetchedModel.related(relation).attach(models);
      });
    });
}

function dedup(match, fromItems, toItems) {
  return _.reject(toItems, item => fromItems.findWhere(matchObj(match, item)));
}

async function fetchRelationData({ from, to }, options) {
  options = options || {};
  const fromOptions = Object.assign({}, options, {
    withRelated: [from.relation],
  });

  return Promise.props({
    fromValues: models[from.model].fetchAll(fromOptions),
    toValues: models[to.model].findAll(options),
  });
}

/**
 * @param {String|Array} match The attribute to match on eg: "name"
 * @param {String|Integer} key The from attribute value eg: "Owner"
 * @param {String|Array} value The to attribute value eg: ""
 *
 * @return {Function} The predicate function.
 */
function matchFunc(match, key, value) {
  if (_.isArray(match)) {
    return item => {
      var valueTest = true;

      if (_.isArray(value)) {
        valueTest = value.indexOf(item.get(match[1])) > -1;
      } else if (value !== 'all') {
        valueTest = item.get(match[1]) === value;
      }

      return item.get(match[0]) === key && valueTest;
    };
  }

  return item => {
    key = key === 0 && value ? value : key;
    return item.get(match) === key;
  };
}

function matchObj(match, item) {
  var matchObj = {};
  if (_.isArray(match)) {
    _.each(match, function(matchProp) {
      matchObj[matchProp] = item.get(matchProp);
    });
  } else {
    matchObj[match] = item.get(match);
  }
  return matchObj;
}
