const { v4: uuidv4 } = require('uuid');
const contactModel = require('../models/contactModel');
const { formatDate } = require('../utils/helpers');

/**
 * @desc    Get all contact submissions
 * @route   GET /api/contacts
 * @access  Private
 */
exports.getAllContacts = async (req, res) => {
  const contacts = await contactModel.findByStatus();
  res.json(contacts);
};

/**
 * @desc    Get single contact by ID
 * @route   GET /api/contacts/:id
 * @access  Private
 */
exports.getContactById = async (req, res) => {
  const contact = await contactModel.findById(req.params.id);
  
  if (!contact) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  
  res.json(contact);
};

/**
 * @desc    Create new contact submission
 * @route   POST /api/contacts
 * @access  Public
 */
exports.createContact = async (req, res) => {
  const newContact = {
    id: uuidv4(),
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message,
    submittedAt: formatDate(),
    status: 'unread'
  };
  
  const createdContact = await contactModel.create(newContact);
  res.status(201).json(createdContact);
};

/**
 * @desc    Update contact (mark as read/unread)
 * @route   PUT /api/contacts/:id
 * @access  Private
 */
exports.updateContact = async (req, res) => {
  const updatedContact = await contactModel.update(req.params.id, req.body);
  
  if (!updatedContact) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  
  res.json(updatedContact);
};

/**
 * @desc    Delete contact submission
 * @route   DELETE /api/contacts/:id
 * @access  Private
 */
exports.deleteContact = async (req, res) => {
  const success = await contactModel.delete(req.params.id);
  
  if (!success) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  
  res.json({ message: 'Contact deleted successfully' });
};

/**
 * @desc    Get contact statistics
 * @route   GET /api/contacts/stats
 * @access  Private
 */
exports.getContactStatistics = async (req, res) => {
  const stats = await contactModel.getStatistics();
  res.json(stats);
};
