const express = require('express');
const router = express.Router();
const expressLayouts = require('express-ejs-layouts');
const Author = require('../models/author');

//All Authors Route
router.get('/', async (req, res) => {
	let searchOptions = {};
	if (req.query.name && req.query.name !== '') {
		searchOptions.name = new RegExp(req.query.name, 'i')
	} 							
	try {
		const authors = await Author.find(searchOptions)
		res.render('authors/index', {
			authors: authors,
			searchOptions: req.query 
		})
	} catch (err) {
		console.log(err)
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
		let locals = { errorMessage: err }
		res.render('authors/new', {author: author, locals} ) 		
	}	
});

module.exports = router;