'use strict';
module.exports = function (app) {
  const express = require('express'),
        jwt = require('express-jwt'),
        _model = require('./permission.model')(app)
  ;


  let jwtCheck = jwt({ secret: process.env.cookie_secret });

  app.get('/permissions/components', (req, res) => {
    _model.getComponents().subscribe(resp => res.status(200).json(resp), err => res.status(400).json(err.message));
  });
  app.get('/permissions/roles', (req, res) => {
    _model.getRoles().subscribe(resp => res.status(200).json(resp), err => res.status(400).json(err.message));
  });
  app.get('/permissions/operations', (req, res) => {
    _model.getOperations().subscribe(resp => res.status(200).json(resp), err => res.status(400).json(err.message));
  });

  app.get('/permissions', jwtCheck, (req, res) => {
    if (req.query === undefined || req.query.component_ids === undefined) {
      return res.status(400).json({ message: 'Bad request. Invalid or missing component id.'})
    }

    let roleTable = 'personnel_roles';
    let roleColumn = 'personnel_id';
    let rolePerson = req.user.id;
    let roleQuery = req.query;

    _model.personnelComponents(roleTable, roleColumn, rolePerson, roleQuery).subscribe(resp => {
      res.status(200).json(resp);
    }, err => {
      res.status(400).json(err);
    });

  });

/*

  app.get('/permissions/personnel/:personnel_id', (req, res) => {
    const query = req.query;
    if ( query === undefined || query.role_id === undefined || query.component_id === undefined) {
      res.status(400).json({ message: 'Bad request. Invalid or missing role or component IDs.'})
    }
    const params = req.params;
    //let db = app.locals.db.get('personnel');
    //db.knex(`${db.db_ref}.personnel`)
    //.where({ id: params.personnel_id })

    Personnel
      .where({ id: params.personnel_id })
      .fetch({ require: true, withRelated: ['personnelRoles'] })
      .then((personnel) => {
        res.json(personnel);
      })
      .catch((error) => {
        if(error.message !== undefined && error.message === "EmptyResponse") {
          res.status(404).json({ message: 'Personnel not found.' });
        } else {
          res.status(400).json(error);
        }
      });


  });
*/
}
