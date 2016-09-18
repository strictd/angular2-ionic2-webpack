'use strict';

module.exports = function (app) {
  let modules = {},
      Rx = require('rxjs')
  ;

  modules.getRoles = function() {
    let db = app.locals.db.get('p_roles');
    return Rx.Observable.fromPromise(db.knex('p_roles'));
  }

  modules.getComponents = function() {
    let db = app.locals.db.get('p_components');
    return Rx.Observable.fromPromise(db.knex('p_components'));
  }

  modules.getOperations = function() {
    let db = app.locals.db.get('p_operations');
    return Rx.Observable.fromPromise(db.knex('p_operations'));
  }


  modules.personnelComponents = function(roleTable, roleColumn, rolePerson, query) {
    return Rx.Observable.create(observer => {

      let dbRoles = app.locals.db.get(roleTable);

      let roleQuery = dbRoles.knex(`${dbRoles.db_ref}.${roleTable}`).where(roleColumn, rolePerson).andWhere(function() {
        let myWhere = this;
        let arrComponents = query.component_ids.split(',');
        let cCnt = arrComponents.length;
        for (let cC=0;cC<cCnt;cC++) {
          if (cC===0) { myWhere.where('component_id', arrComponents[cC]); }
          else { myWhere.orWhere('component_id', arrComponents[cC]); }
        }
      }).select('role_id');


      let dbPermissions = app.locals.db.get('p_permissions');
      dbPermissions.knex(`${dbPermissions.db_ref}.p_permission`)
        .where('role_id', 'in', roleQuery)
        .leftJoin('p_roles', 'p_roles.id', '=', 'p_permission.role_id')
        .leftJoin('p_operations', 'p_operations.id', '=', 'p_permission.operation_id')
        .leftJoin('p_components', 'p_components.id', '=', 'p_permission.component_id')
        .select(['p_components.id as component_id', 'p_components.tag as component_tag', 'p_roles.tag as role_tag', 'p_operations.tag as operation_tag', 'role_id', 'operation_id'])
        .then(permissions => {

          let retPerms = {};
          let retRoles = {};
          let retComponents = {};
          let retOperations = {};

          permissions.map(function(obj) {
            let component_id = parseInt(obj.component_id);

            // Build Params Array
            if (retPerms[component_id] === undefined) retPerms[component_id] = {};

            // Setup Layout
            if (retPerms[component_id].operations === undefined) retPerms[component_id].operations = [];
            retPerms[component_id].operations.push(obj.operation_id);

            // Setup Role
            retPerms[component_id].role_id = obj.role_id;

            // Role Tag, Component Tag
            retPerms[component_id].role_tag = obj.role_tag;
            retPerms[component_id].component_tag = obj.component_tag;

            // Stuff Tag Definitions into ret values
            retRoles[obj.role_id] = obj.role_tag;
            retComponents[obj.component_id] = obj.component_tag;
            retOperations[obj.operation_id] = obj.operation_tag;
          });
          observer.next({'components': retPerms, 'role_tag': retRoles, 'component_tag': retComponents, 'operation_tag': retOperations});
          //res.status(200).json();
        })
        .catch((error) => {
          if(error.message !== undefined && error.message === 'EmptyResponse') {
            observer.error({ message: 'Permissions not found.' })
            //res.status(404).json();
          } else {
            observer.error({ message: error})
            //res.status(400).json({ message: error});
          }
        });
    });
  }
  return modules;
};