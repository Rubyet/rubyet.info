const fs = require('fs').promises;
const { CONTACTS_FILE } = require('../config/database');

class ContactModel {
  /**
   * Read all contacts from file
   * @returns {Promise<Array>} Array of contacts
   */
  async findAll() {
    try {
      const data = await fs.readFile(CONTACTS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading contacts:', error);
      return [];
    }
  }

  /**
   * Find contact by ID
   * @param {string} id - Contact ID
   * @returns {Promise<Object|null>} Contact object or null
   */
  async findById(id) {
    const contacts = await this.findAll();
    return contacts.find(c => c.id === id) || null;
  }

  /**
   * Find contacts by status
   * @param {string} status - Contact status ('read', 'unread', or 'all')
   * @returns {Promise<Array>} Filtered contacts
   */
  async findByStatus(status = 'all') {
    let contacts = await this.findAll();
    
    if (status === 'read') {
      contacts = contacts.filter(c => c.status === 'read');
    } else if (status === 'unread') {
      contacts = contacts.filter(c => c.status === 'unread');
    }
    
    return contacts.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  }

  /**
   * Get contact statistics
   * @returns {Promise<Object>} Contact statistics
   */
  async getStatistics() {
    const contacts = await this.findAll();
    
    return {
      total: contacts.length,
      unread: contacts.filter(c => c.status === 'unread').length,
      read: contacts.filter(c => c.status === 'read').length
    };
  }

  /**
   * Create new contact submission
   * @param {Object} contactData - Contact data
   * @returns {Promise<Object>} Created contact
   */
  async create(contactData) {
    const contacts = await this.findAll();
    contacts.push(contactData);
    await this.save(contacts);
    return contactData;
  }

  /**
   * Update contact
   * @param {string} id - Contact ID
   * @param {Object} updates - Updated data
   * @returns {Promise<Object|null>} Updated contact or null
   */
  async update(id, updates) {
    const contacts = await this.findAll();
    const index = contacts.findIndex(c => c.id === id);
    
    if (index === -1) {
      return null;
    }
    
    contacts[index] = { ...contacts[index], ...updates, id };
    await this.save(contacts);
    return contacts[index];
  }

  /**
   * Delete contact
   * @param {string} id - Contact ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const contacts = await this.findAll();
    const filteredContacts = contacts.filter(c => c.id !== id);
    
    if (filteredContacts.length === contacts.length) {
      return false;
    }
    
    await this.save(filteredContacts);
    return true;
  }

  /**
   * Save contacts to file
   * @param {Array} contacts - Contacts array to save
   * @returns {Promise<boolean>} Success status
   */
  async save(contacts) {
    try {
      await fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
      return true;
    } catch (error) {
      console.error('Error writing contacts:', error);
      return false;
    }
  }
}

module.exports = new ContactModel();
