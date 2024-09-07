const { SEND, LOCALIDADES } = require('../global/_var')

/******** DEPENDENCY  *******/

const express = require('express');
const route = express.Router()

/******** CONTROLLER *******/

const getInfoController = require('../controllers/getInfo.Controller.js')
const saveInfoController = require('../controllers/saveInfo.Controller.js')

/******** ROUTER *********/

route.post(SEND, getInfoController.PolizaDoc);
route.get(LOCALIDADES, saveInfoController.localidadesInfo)

module.exports= route