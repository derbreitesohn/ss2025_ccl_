const favoriteModel = require("../models/listingModel");
const req = require("express/lib/request");
const res = require("express/lib/response");

// Add a favorite (like)
function addFavorite(req, res) {
    const userId = req.user.id;
    const listingId = req.params.listingId;

    favoriteModel.addFavorite(userId, listingId)
        .then(() => res.status(200).json({ message: "Favorited" }))
        .catch(err => res.status(500).send(err.message));
}

// Remove a favorite (unlike)
function removeFavorite(req, res) {
    const userId = req.user.id;
    const listingId = req.params.listingId;

    favoriteModel.removeFavorite(userId, listingId)
        .then(() => res.status(200).json({ message: "Unfavorited" }))
        .catch(err => res.status(500).send(err.message));
}

// Check if a listing is favorited
function isFavorited(req, res) {
    const userId = req.user.id;
    const listingId = req.params.listingId;

    favoriteModel.isFavorited(userId, listingId)
        .then(isFav => res.status(200).json({ isFavorited: isFav }))
        .catch(err => res.status(500).send(err.message));
}

// Get all favorites for current user
function getFavorites(req, res) {
    const userId = req.user.id;

    favoriteModel.getFavoritesByUser(userId)
        .then(favorites => res.status(200).json({ favorites }))
        .catch(err => res.status(500).send(err.message));
}

module.exports = {
    addFavorite,
    removeFavorite,
    isFavorited,
    getFavorites
};