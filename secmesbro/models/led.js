// A blog post model


var Led = {
  leds: [
    {
      id: '1',
      color: 'red',
      status: 'off'
    },
    {
        id: '2',
        color: 'yellow',
        status: 'on'
    }
  ],
  last_id: 1,

  getNextId: function () {
    this.last_id += 1;
    return this.last_id;
  },

  clone: function (data) {
    // JavaScript doesn't have a real clone function
    // This is good enough for simple, data-only objects
    return JSON.parse(JSON.stringify(data));
  },

  // merges object with the attributes passed into this function
  //
  merge: function(object, attr) {
    for (var attrname in attr) {
      object[attrname] = attr[attrname];
    }
    return object;
  },

  add: function (data) {
    // poor mans 'dup' (ruby), otherwise we will be modifying the original object
    console.log('creating led with ' + data);
    var data = this.clone(data);
    var id = this.getNextId();
    data.id = id;
    this.leds.push(data);
    return data;
  },

  update: function(data) {
    console.log('updating with ' + data);
    for (var i = 0; i < this.taks.length; i++) {
      if (this.leds[i].id == data['id']) {
        Led.merge(this.leds[i], data);
        return this.leds[i];
      }
    }
    return void 0;
  },

  find: function (id) {
    for (var i = 0; i < this.leds.length; i++) {
      if (this.leds[i].id == id) {
        return this.leds[i];
      }
    }
    return void 0;
  },

  remove: function (id) {
    for (var i = 0; i < this.leds.length; i++) {
      if (this.leds[i].id == id) {
        var led = this.leds[i];
        this.leds.splice(i, 1);
        return led; // remove element and return it
      }

    }
    return void 0;
  },

  all: function () {
    return this.leds;
  },

  clearAllEntries: function () {
    this.leds = [];
    this.last_id = 0;
  }
};


exports.getAllEntries = function () {
  return Led.all();
};

exports.clearAllEntries = function () {
  return Led.clearAllEntries();
};



exports.create = function (data) {
  return Led.add(data);

};


exports.update = function (data) {
  return Led.update(data);
};



exports.find = function (id) {
  return Led.find(id);
};

exports.remove = function (id) {
  return Led.remove(id);
}


