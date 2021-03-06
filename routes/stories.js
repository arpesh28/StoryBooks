const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');

// Stories Index
router.get('/', (req, res) => {
    Story.find({status: 'public'})
        .populate('user')
        .lean()
        .then(stories => {
            res.render('stories/index', {
                stories:stories
            })
        })
});

// Show Single Story
router.get('/show/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
    .lean()
    .then(story =>{
        res.render('stories/show', {
            story: story
        });
    });
});

// Add Story form 
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add');
});

// Edit Story Form 
router.get('/edit', ensureAuthenticated, (req, res) => {
    res.render('stories/edit');
})

// Process Add story form
router.post('/', (req, res) => {
    let allowComments;

    if(req.body.allowComments){
        allowComments = true;
    } else {
        allowComments = false;
    }

    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    }

    // Create Story
    new Story(newStory)
        .save()
        .then(story => {
            res.redirect(`/stories/show/${story.id}`);
        })
})

module.exports = router;