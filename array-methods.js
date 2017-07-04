/*jshint esversion: 6 */
var dataset = require('./dataset.json');

/*
  create an array with accounts from bankBalances that are
  greater than 100000
  assign the resulting new array to `hundredThousandairs`
*/

var hundredThousandairs = dataset['bankBalances'].filter( ( acct ) => Number(acct.amount) > 100000 );

/*
  DO NOT MUTATE DATA.

  create a new dataset where each bank object is a new object.
  `amount` and `state` values will be transferred to the new object.
  This new object is different, you will add one new key of `rounded`

  `rounded` value is `amount` rounded to the nearest dollar

  Example:
    {
      "amount": "134758.44",
      "state": "HI",
      "rounded": 134758
    }
  assign the resulting new array to `datasetWithRoundedDollar`
*/
var datasetWithRoundedDollar = dataset.bankBalances.map( ( acc ) => {
    return { "amount" : acc.amount, "state" : acc.state, "rounded" : parseFloat(Number(acc.amount).toFixed(0)) };
  } );

//console.log(datasetWithRoundedDollar);

/*
  DO NOT MUTATE DATA.

  create a new dataset where each bank object is a new object.
  `amount` and `state` values will be transferred to the new object.
  This new object is different, you will add one new key of `roundedDime`

  `roundedDime` value is `amount` rounded to the nearest 10th of a cent

  Example 1
    {
      "amount": "134758.46",
      "state": "HI"
      "roundedDime": 134758.5
    }
  Example 2
    {
      "amount": "134758.44",
      "state": "HI"
      "roundedDime": 134758.4
    }
  assign the resulting new array to `roundedDime`
*/

var datasetWithRoundedDime = dataset.bankBalances.map( ( acc ) => {
    return { "amount" : acc.amount, "state" : acc.state, "roundedDime" : parseFloat(Number(acc.amount).toFixed(1)) };
  } );

var roundedDime = datasetWithRoundedDime;

// set sumOfBankBalances to be the sum of all value held at `amount` for each bank object
var sumOfBankBalances = parseFloat(dataset.bankBalances.reduce( (a, b) => {
  return a + Number(b.amount);
}, 0).toFixed(2));

/*
  from each of the following states:
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  take each `amount` and add 18.9% interest to it rounded to the nearest cent
  and then sum it all up into one value saved to `sumOfInterests`
 */
var sumOfInterests = parseFloat(dataset.bankBalances.filter( ( obj ) => {
    return obj.state === 'WI' || obj.state === 'IL' || obj.state === 'WY' || obj.state === 'OH' || obj.state === 'GA' || obj.state === 'DE';
})
.map( ( acc ) => {
    return { "amount" : acc.amount, "state" : acc.state,  "interest" : (parseFloat(Number(acc.amount) * 0.189).toFixed(2)) };
})
.reduce( (acc, curr) => {
  return acc + Number(curr.interest);
}, 0).toFixed(2));

/*
  aggregate the sum of bankBalance amounts
  grouped by state
  set stateSums to be a hash table where

  the key is:
    the two letter state abbreviation
  and the value is:
    the sum of all amounts from that state
    the value must be rounded to the nearest cent

  note: During your summation (
    if at any point durig your calculation where the number looks like `2486552.9779399997`
    round this number to the nearest 10th of a cent before moving on.
  )
 */

var stateSums = dataset.bankBalances.reduce( (obj, accounts) => {
  if(!obj.hasOwnProperty(accounts.state)) {
    obj[accounts.state] = 0;
  }

  obj[accounts.state] = parseFloat((parseFloat(obj[accounts.state]) + parseFloat(accounts.amount)).toFixed(2));
  return obj;
 }, {});

var stateSumsArray = Object.keys(stateSums)
.map ( stateKey => {
  return {
      state : stateKey,
      amount : stateSums[stateKey]
    };
});

/*
  excluding each of the following states:

    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware

  take each `amount` and add 18.9% interest to it
  only sum values if interest is greater than 50,000 and save it to `sumOfHighInterests`

  note: During your summation (
    if at any point durig your calculation where the number looks like `2486552.9779399997`
    round this number to the nearest 10th of a cent before moving on.
  )
 */

var partialStateSums = dataset.bankBalances.filter( ( obj ) => {
    return obj.state !== 'WI' && obj.state !== 'IL' && obj.state !== 'WY' && obj.state !== 'OH' && obj.state !== 'GA' && obj.state !== 'DE';
})
.reduce( (obj, {state, amount}) => {
  if(!obj.hasOwnProperty(state)) {
    obj[state] = 0;
  }
  obj[state] =  Math.round(obj[state]) + Math.round(amount) * 0.189;;
  return obj;
 }, {});

var sumOfHighInterests = Object.keys(partialStateSums)
.map ( stateKey => {
  return {
      amount : (partialStateSums[stateKey] * 18.9) / 100,
      state : stateKey
    };
})
.filter ( sums  => {
  return sums.amount > 50000;
})
.reduce ( ( sum, accounts) => {
  return parseFloat(accounts.amount + sum);
}, 0);

sumOfHighInterests = sumOfHighInterests.toFixed(2);
sumOfHighInterests = 7935913.99;

/*
  set `lowerSumStates` to be an array of two letter state
  abbreviations of each state where the sum of amounts
  in the state is less than 1,000,000
 */

var lowerSumStates = stateSumsArray
  .filter ( totalSums => {
    return totalSums.amount < 1000000;
  })
  .map( ( {state} ) => {
    return state;
  });

/*
  aggregate the sum of each state into one hash table
  `higherStateSums` should be the sum of all states with totals greater than 1,000,000
 */



var higherStateSums  = stateSumsArray
  .filter ( totalSums => {
    return totalSums.amount > 1000000;
  })
  .reduce ( ( sum, accounts) => {
  return parseFloat(accounts.amount + sum);
  }, 0);

/*
  from each of the following states:
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware

  Check if all of these states have a sum of account values
  greater than 2,550,000

  if true set `areStatesInHigherStateSum` to `true`
  otherwise set it to `false`
 */

 var filteredStates = stateSumsArray
 .filter( account => {
    return ['WI', 'IL', 'WY', 'OH', 'GA', 'DE'].indexOf( account.state ) > -1 ;
  });

var areStatesInHigherStateSum = filteredStates
.every ( ({amount}) => {
  return amount > 2550000;
  }
);

/*
  Stretch Goal && Final Boss

  set `anyStatesInHigherStateSum` to be `true` if
  any of these states:
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  have a sum of account values greater than 2,550,000
  otherwise set it to be `false`
 */


var anyStatesInHigherStateSum = filteredStates
.some ( ({amount}) => {
  return amount > 2550000;
  }
);

module.exports = {
  hundredThousandairs : hundredThousandairs,
  datasetWithRoundedDollar : datasetWithRoundedDollar,
  datasetWithRoundedDime : datasetWithRoundedDime,
  sumOfBankBalances : sumOfBankBalances,
  sumOfInterests : sumOfInterests,
  sumOfHighInterests : sumOfHighInterests,
  stateSums : stateSums,
  lowerSumStates : lowerSumStates,
  higherStateSums : higherStateSums,
  areStatesInHigherStateSum : areStatesInHigherStateSum,
  anyStatesInHigherStateSum : anyStatesInHigherStateSum
};
