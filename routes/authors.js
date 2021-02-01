const express = require('express');
const router = express.Router();
const expressLayouts = require('express-ejs-layouts');
const Author = require('../models/author');
let searchOptions = {};

//All Authors Route
router.get('/', async (req, res) => {
	if (req.query.name && req.query.name !== "") {
		searchOptions.name = new RegExp(req.query.name, 
			'i')
	} 							// bc while post req are in body, get are in query strings in url
	try {
		const authors = await Author.find(searchOptions)
		res.render('authors/index', { 
			authors: authors,
			searchOptions: req.query 
		})
	} catch {
		res.redirect('/')
	}
});

//New Authors Route
router.get('/new', (req, res) => {
	res.render('authors/new', { author: new Author() });
});

//Create Author Route
router.post('/', async (req, res) => {
	const author = new Author({
		name: req.body.name
	})
	try {
		const newAuthor = await author.save()
		// res.redirect(`authors/${newAuthor.id}`)
		res.redirect(`authors`)		
	} catch {
		let locals = { errorMessage: 'Error creating Author' }
		res.render('authors/new', {author, locals} ) 		
	}	
});

module.exports = router;