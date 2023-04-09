const express = require('express')
const Router = express.Router()

//Import All Controller
const { adminMutationController } = require('../controller')

Router.get('/view', adminMutationController.viewMutation)
Router.get('/fetch-status', adminMutationController.fetchStatus)
Router.get('/fetch-wh-list', adminMutationController.fetchWarehouse)
Router.post('/add-mutation', adminMutationController.addMutation)
Router.patch('/approve-mutation/:id', adminMutationController.approveMutation)
Router.patch('/cancel-mutation/:id', adminMutationController.cancelMutation)
Router.patch('/reject-mutation/:id', adminMutationController.rejectMutation)


module.exports = Router