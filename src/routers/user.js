const express = require('express')
const auth = require('../middleware/auth')
const user = require('../controllers/user.controller')
const router = express.Router()
const API_ENDPOINT = '/api/users'

router.post(API_ENDPOINT, user.createUser)

router.get(`${API_ENDPOINT}`, auth, user.getAllUser)

router.post(`${API_ENDPOINT}/login`, user.login)

router.get(`${API_ENDPOINT}/me`, auth, user.getInfo)

router.post(`${API_ENDPOINT}/logout`, auth, user.logout)

router.post(`${API_ENDPOINT}/logoutall`, auth, user.logoutAll)
module.exports = router;