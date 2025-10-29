import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiMail,
  FiInbox,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiUser,
  FiClock,
  FiMessageSquare
} from 'react-icons/fi';
import './AdminContactsContent.css';

const AdminContactsContent = () => {
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/contacts`);
      const data = await response.json();
      
      // Apply filter
      let filtered = data;
      if (filter === 'unread') {
        filtered = data.filter(c => c.status === 'unread');
      } else if (filter === 'read') {
        filtered = data.filter(c => c.status === 'read');
      }
      
      // Apply search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(c => 
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.subject.toLowerCase().includes(query) ||
          c.message.toLowerCase().includes(query)
        );
      }
      
      setFilteredContacts(filtered);
      
      // Calculate statistics
      const stats = {
        total: data.length,
        unread: data.filter(c => c.status === 'unread').length,
        read: data.filter(c => c.status === 'read').length
      };
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  }, [filter, searchQuery, API_URL]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete the message from "${name}"?`)) {
      try {
        await fetch(`${API_URL}/contacts/${id}`, {
          method: 'DELETE',
        });
        loadData();
        if (selectedContact?.id === id) {
          setSelectedContact(null);
        }
      } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Failed to delete contact. Please try again.');
      }
    }
  };

  const handleToggleStatus = async (contact) => {
    const newStatus = contact.status === 'read' ? 'unread' : 'read';
    try {
      await fetch(`${API_URL}/contacts/${contact.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      loadData();
      if (selectedContact?.id === contact.id) {
        setSelectedContact({ ...contact, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
      alert('Failed to update contact status. Please try again.');
    }
  };

  const handleViewContact = async (contact) => {
    setSelectedContact(contact);
    
    // Mark as read if it's unread
    if (contact.status === 'unread') {
      try {
        await fetch(`${API_URL}/contacts/${contact.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'read' }),
        });
        loadData();
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="admin-contacts-content">
      {/* Statistics */}
      {statistics && (
        <motion.div 
          className="statistics-grid"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="stat-card">
            <div className="stat-icon total">
              <FiMessageSquare />
            </div>
            <div className="stat-content">
              <h3>{statistics.total}</h3>
              <p>Total Messages</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon unread">
              <FiMail />
            </div>
            <div className="stat-content">
              <h3>{statistics.unread}</h3>
              <p>Unread</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon read">
              <FiInbox />
            </div>
            <div className="stat-content">
              <h3>{statistics.read}</h3>
              <p>Read</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <motion.div 
        className="admin-controls"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            <FiFilter /> All
          </button>
          <button
            className={filter === 'unread' ? 'active' : ''}
            onClick={() => setFilter('unread')}
          >
            <FiMail /> Unread
          </button>
          <button
            className={filter === 'read' ? 'active' : ''}
            onClick={() => setFilter('read')}
          >
            <FiInbox /> Read
          </button>
        </div>
      </motion.div>

      {/* Contacts Layout */}
      <motion.div 
        className="contacts-layout"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Contact List */}
        <div className="contacts-list">
          {loading ? (
            <div className="loading-state">Loading contacts...</div>
          ) : filteredContacts.length === 0 ? (
            <div className="empty-state">
              <FiMail size={48} />
              <h3>No contacts found</h3>
              <p>
                {searchQuery 
                  ? 'Try adjusting your search query'
                  : 'No contact submissions yet'
                }
              </p>
            </div>
          ) : (
            <div className="contact-items">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`contact-item ${contact.status} ${selectedContact?.id === contact.id ? 'selected' : ''}`}
                  onClick={() => handleViewContact(contact)}
                >
                  <div className="contact-item-header">
                    <div className="contact-item-icon">
                      {contact.status === 'unread' ? <FiMail /> : <FiInbox />}
                    </div>
                    <div className="contact-item-info">
                      <h4>{contact.name}</h4>
                      <p className="contact-email">{contact.email}</p>
                    </div>
                  </div>
                  <h5 className="contact-subject">{contact.subject}</h5>
                  <p className="contact-preview">{contact.message.substring(0, 100)}...</p>
                  <div className="contact-item-footer">
                    <span className="contact-date">
                      <FiClock /> {formatDate(contact.submittedAt)}
                    </span>
                    <span className={`status-badge ${contact.status}`}>
                      {contact.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Detail */}
        <div className="contact-detail">
          {selectedContact ? (
            <>
              <div className="contact-detail-header">
                <div>
                  <h3>{selectedContact.subject}</h3>
                  <div className="contact-detail-meta">
                    <span><FiUser /> {selectedContact.name}</span>
                    <span><FiMail /> {selectedContact.email}</span>
                    <span><FiClock /> {formatDate(selectedContact.submittedAt)}</span>
                  </div>
                </div>
                <div className="contact-detail-actions">
                  <button
                    onClick={() => handleToggleStatus(selectedContact)}
                    className="action-btn toggle"
                    title={selectedContact.status === 'read' ? 'Mark as unread' : 'Mark as read'}
                  >
                    {selectedContact.status === 'read' ? <FiMail /> : <FiInbox />}
                  </button>
                  <button
                    onClick={() => handleDelete(selectedContact.id, selectedContact.name)}
                    className="action-btn delete"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <div className="contact-detail-body">
                <h4>Message:</h4>
                <p>{selectedContact.message}</p>
              </div>
              <div className="contact-detail-footer">
                <a 
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                  className="reply-btn"
                >
                  <FiMail /> Reply via Email
                </a>
              </div>
            </>
          ) : (
            <div className="contact-detail-empty">
              <FiMail size={64} />
              <h3>Select a message to view</h3>
              <p>Choose a contact from the list to see the full details</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminContactsContent;
