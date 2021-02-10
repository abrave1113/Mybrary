const express = require('express');
const router = express.Router();
const expressLayouts = require('express-ejs-layouts');
const Author = require('../models/author');
const Book = require('../models/book')

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
	} catch (e) {
		res.redirect('/')
	}
});

//New Author Route
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
		res.redirect(`authors/${newAuthor.id}`)
	} catch (e) {
		res.render('authors/new', {
			author: author, 
			errorMessage: 'Error creating author' 
		}) 		
	}	
});

router.get('/:id', async (req, res) => {
	try {
		const author = await Author.findById(req.params.id)
		const books = await Book.find({author: author.id}).limit(6).exec()
		res.render('authors/show', { 
			author: author,
			booksByAuthor: books
		})
	} catch (err) {
		console.log(err)
		res.redirect('/')
	}
})

router.get('/:id/edit', async (req, res) => {
	try {
		const author = await Author.findById(req.params.id)
		res.render('authors/edit', { author: author });
	} catch {
		res.redirect('/authors')
	}
	
})

router.put('/:id', async (req, res) => {
		let author
		try {
			author = await Author.findById(req.params.id)
			author.name = req.body.name
			await author.save()
			res.redirect(`/authors/${author.id}`)
		} catch (e) {
			if (author == null) {
				res.redirect('/')
			} else {
			res.render('authors/edit', {
				author: author, 
				errorMessage: 'Error updating author' 
			}) 		
		}
	}	
})

router.delete('/:id', async (req, res) => {
	let author
	try {
		author = await Author.findById(req.params.id)
		await author.remove()
		res.redirect(`/authors`)
	} catch (e) {
		if (author == null) {
			res.redirect('/')
		} else {
		res.redirect(`/authors/${author.id}`)
		} 		
	}
})	


module.exports = router;