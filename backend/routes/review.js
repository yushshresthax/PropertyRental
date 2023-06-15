const router = require('express').Router();
const Review = require('../models/ReviewSchema');
const Property = require('../models/Property');
const verifyToken = require('../middlewares/verifyToken');




// Create a new review
router.route('/add').post(verifyToken, (req, res) => {

    const newReview = new Review({
        userId: req.user.id,
        propertyId: req.body.propertyId,
        rating: req.body.rating,
        comment: req.body.comment
    });

    // Find the property associated with the review
    Property.findOne({ _id: req.body.propertyId })
        .then(property => {
            if (!property) {
                return res.status(404).json({ message: 'Property not found' });
            }

            // Calculate the new average rating and update the property document
            let newNumReviews = property.numReviews + 1;
            let newTotalRating = property.rating * property.numReviews + req.body.rating;
            let newAvgRating = newTotalRating / newNumReviews;

            Property.updateOne(
                { _id: property._id },
                { $set: { rating: newAvgRating, numReviews: newNumReviews } }
            )
                .then(() => {
                    newReview.save()
                        .then(review => res.json({ message: 'Review added' }))
                        .catch(err => res.status(400).json('Error: ' + err));
                })
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// Update a review
router.route('/:id').put(verifyToken, (req, res) => {
    Review.findById(req.params.id)
        .then(review => {
            if (!review) {
                return res.status(404).json({ message: 'Review not found' });
            }

            // Find the property associated with the review
            Property.findOne({ _id: review.propertyId })
                .then(property => {
                    if (!property) {
                        return res.status(404).json({ message: 'Property not found' });
                    }

                    // Calculate the new average rating and update the property document
                    let newTotalRating = property.rating * property.numReviews - review.rating + req.body.rating;
                    let newAvgRating = newTotalRating / property.numReviews;

                    Property.updateOne(
                        { _id: property._id },
                        { $set: { rating: newAvgRating } }
                    )
                        .then(() => {
                            review.userId = req.user.id;
                            review.rating = req.body.rating;
                            review.comment = req.body.comment;

                            review.save()
                                .then(() => res.json({ message: 'Review updated' }))
                                .catch(err => res.status(400).json('Error: ' + err));
                        })
                        .catch(err => res.status(400).json('Error: ' + err));
                })
                .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});


// Delete a review
router.route('/:id').delete(verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        // Get the existing review
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Update the corresponding property's rating and number of reviews
        const property = await Property.findById(review.propertyId);
        if (!property) {
            return res.status(404).json({ message: 'property not found' });
        }
        if (property.numReviews > 1) {
            property.rating = (property.rating * property.numReviews - review.rating) / (property.numReviews - 1);
        } else {
            property.rating = 0;
        }
        property.numReviews -= 1;
        await property.save();

        // Delete the review
        await review.delete();

        res.json({ message: 'Review Deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all reviews for a property
router.route('/property/:id').get((req, res) => {
    Review.find({ propertyId: req.params.id }).populate('userId')
        .then(reviews => res.json(reviews))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Get a user's review for a property
router.route('/user/:propertyId').get(verifyToken, (req, res) => {
    Review.findOne({
        propertyId: req.params.propertyId,
        userId: req.user.id
    }).populate('userId')
        .then(review => {
            if (review) {
                res.json(review);
            } else {
                res.json(null);
            }
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router