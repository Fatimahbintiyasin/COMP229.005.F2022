// File Name: businesscontacts.js
// Student Name: Fatimah Binti Yasin
// Student ID:  301193282
// Date: Oct 24, 2022



var express = require('express');
var router = express.Router();

let businessController = require('../controllers/businesscontacts');

// helper function for guard purposes
function requireAuth(req, res, next)
{
    // check if the user is logged in
    if(!req.isAuthenticated())
    {
        req.session.url = req.originalUrl;
        return res.redirect('/users/signin');
    }
    next();
}

/* GET list of items */
router.get('/list', businessController.businessContactsList);

// Routers for edit
router.get('/edit/:id', requireAuth, businessController.displayEditPage);
router.post('/edit/:id', requireAuth, businessController.processEditPage);

// Delete
router.get('/delete/:id', requireAuth, businessController.performDelete);


/* GET Route for displaying the Add page - CREATE Operation */
router.get('/add', requireAuth, businessController.displayAddPage);

/* POST Route for processing the Add page - CREATE Operation */
router.post('/add', requireAuth, businessController.processAddPage);

module.exports = router;