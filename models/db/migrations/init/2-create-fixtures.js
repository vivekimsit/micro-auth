'use strict';

const Promise = require('bluebird');
const _ = require('lodash');

const fixtures = require('../../schema/fixtures');
const logger = require('../../../../web/lib/logger');
const models = require('../../../');

module.exports.config = {
  transaction: true,
};

module.exports.up = function insertFixtures({ connection }) {
  return Promise.mapSeries(fixtures.models, function(model) {
    logger.info('Model: ' + model.name);

    return addFixturesForModel(model);
  }).then(function() {
    return Promise.mapSeries(fixtures.relations || [], function(relation) {
      logger.info(
        'Relation: ' + relation.from.model + ' to ' + relation.to.model
      );
      //return addFixturesForRelation(relation);
    });
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
  var ops = [],
    max = 0;
  const { from, to, entries } = relationFixture;
  const { relation } = from;

  // fetch all data from both relations
  const data = await fetchRelationData(relationFixture, options);
  const { fromValues, toValues } = data;

  _.each(entries, (entry, key) => {
    const fromItem = fromValues.find(
      matchFunc(relationFixture.from.match, key)
    );
    logger.warn(
      `Skip: Target database entry not found for model: ${
        from.model
      } key: ${key}`
    );

    _.each(entry, (value, key) => {
      const toItems = toValues.filter(
        matchFunc(relationFixture.to.match, key, value)
      );
      max += toItems.length;
      toItems = dedup(fromItem.related(relation), toItems, () =>
        matchObj(to.match, item)
      );

      for (const item of items) {
        ops.push(function addRelationItems() {
          return attach(from.model, fromItem.id, relation, toItems, options);
        });
      }
    });
  });
  const results = Promise.reduce(
    ops,
    function(accumulator, task) {
      const result = task.apply(this);
      accumulator.push(result);
    },
    []
  );
  return {
    expected: max,
    done: _(result)
      .map('length')
      .sum(),
  };
}

function dedup(fromItems, toItems, condition) {
  return _.reject(toItems, item => fromItems.findWhere(condition()));
}

async function fetchRelationData({ from, to }, options) {
  const fromOptions = Object.assign({}, options, {
    withRelated: [from.relation],
  });

  return Promise.props({
    from: models[from.model].findAll(fromOptions),
    to: models[to.model].findAll(options),
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
  if (Arrays.isArray(match)) {
    return item => {
      var valueTest = true;

      if (Arrays.isArray(value)) {
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
  if (Arrays.isArray(match)) {
    _.each(match, function(matchProp) {
      matchObj[matchProp] = item.get(matchProp);
    });
  } else {
    matchObj[match] = item.get(match);
  }
  return matchObj;
}
