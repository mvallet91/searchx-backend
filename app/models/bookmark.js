'use strict';

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const BookmarkSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    sessionId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    deleted: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    created: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);