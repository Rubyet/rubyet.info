const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const contactController = require('../controllers/contactController');

// GET routes
router.get('/', asyncHandler(contactController.getAllContacts));
router.get('/stats', asyncHandler(contactController.getContactStatistics));
router.get('/:id', asyncHandler(contactController.getContactById));

// POST routes
router.post('/', asyncHandler(contactController.createContact));

// PUT routes
router.put('/:id', asyncHandler(contactController.updateContact));

// DELETE routes
router.delete('/:id', asyncHandler(contactController.deleteContact));

module.exports = router;
