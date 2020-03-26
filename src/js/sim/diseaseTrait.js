import * as Util from './util';

/*export let mutator = new DiseaseTrait('mutator', function() {
  this.mutatorChance = Util.getRandomInt(1, 101);
}, function(obj) {
  if (this.mutatorChance > Math.random() * 100) {
    if (obj.mutate !== undefined) {
      obj.mutate();
    }

    return true;
  }

  return false;
});*/

export default class DiseaseTrait {
  constructor(name, init, run) {
    this.name = name || `diseaseTrait-${Util.randomHalfName()}`;
    this.run = run || function() {};
    this.init = init || function() {};
  }
}

class ChanceDiseaseTrait extends DiseaseTrait {
  constructor(name, realRun, maxPercent) {
    super(name, undefined, function(obj) {
      if (this.chance > Math.random() * 100) {
        this.realRun(obj);
  
        return true;
      }
      
      return false;
    });

    this.chance = Util.getRandomInt(1, maxPercent || 101);
    this.realRun = realRun || function() {};
  }
}

class OnceDiseaseTrait extends DiseaseTrait {
  constructor(name, realRun) {
    super(name, undefined, function(obj) {
      if (this.ranBefore[obj.name] !== true) {
        realRun(obj);

        this.ranBefore[obj.name] = true;
      }
    });

    this.ranBefore = {};
  }
}

export let Mutator = function() {
  return new ChanceDiseaseTrait('mutator', function(obj) {
    if (obj.mutate !== undefined) {
      obj.mutate();
    }
  }, 2);
};

export let Immunosuppression = function() {
  return new OnceDiseaseTrait('immunosuppression', function(obj) {
    obj.efficiency.immune -= 20;
  });
};

export let ReduceEatingEfficiency = function() {
  return new OnceDiseaseTrait('reduceEatingEfficiency', function(obj) {
    obj.efficiency.eating -= 20;
  });
};

export let ReduceMovementEfficiency = function() {
  return new OnceDiseaseTrait('reduceMovementEfficiency', function(obj) {
    obj.efficiency.movement -= 20;
  })
};

export let diseaseTraits = [
  Mutator,
  Immunosuppression,
  ReduceEatingEfficiency,
  ReduceMovementEfficiency
];

function shuffle(a) {
  var j, x, i;

  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }

  return a;
}

export function randomTraits() {
  let arr = [];
  let aval = shuffle(diseaseTraits);

  for (let i = 0; i < Util.getRandomInt(0, aval.length); i++) {
    let chosen = aval.pop();

    arr.push(new chosen);
  }

  return arr;
}