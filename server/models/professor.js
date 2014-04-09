'use strict';

define(['db', 'node-restful'], function (db, restful) {

  var schema = db.Schema({
    firstname: String,
    lastname: String,
    genre: {
      required: true,
      type: String
    },
    degree: {
      required: true,
      type: String
    },
    rfc: String,
    birth: Date,
    nationality: String,
    pride: String,
    since: Date,
    avatar: String,
    adscription: String,
    college: String,
    appointment: {
      academic: String, // Profesor, Investigador, Técnico Académico
      fulltime: {
        type: Boolean,
        default: false
      },
      permanence: String, // Emérito, Extraordinario, Ordinario, Visitante
      category: String, // Titular, Auxiliar, Asociado
      definitiveness: {
        type: Boolean,
        default: false
      },
      level: String
    },
    curriculum: String,
    training: String,
    teaching: String,
    teaching_thesis: String,
    research: String,
    publishing: String,
    creations: String,
    encouragements: String,
    grants: String,
    awards: String,
    events: String,
    associations: String,
    administration: String,
    pun: {
      type: Boolean,
      default: false
    },
    rdunja: {
      type: Boolean,
      default: false
    },
    status: String,
    created_at: Date,
    updated_at: Date
  });

  var Professor = restful.model('Professor', schema);

  Professor.slug = 'professors';

  return Professor;

});
