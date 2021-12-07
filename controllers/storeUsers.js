const Users = require('../models/Users');
const path = require('path');

module.exports = (req, res) => {
    User.create(req.body, (error, user)=>{
        res.redirect('/')
    })
}