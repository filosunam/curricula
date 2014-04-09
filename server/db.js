'use strict';

define(['conf', 'node-restful'], function (conf, restful) {

  restful.mongoose.connect(conf.mongo.url);
  return restful.mongoose;

});
