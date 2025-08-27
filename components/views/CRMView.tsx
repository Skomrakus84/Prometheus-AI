import React, { useState, useCallback, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Contact } from '../../types';
import { generateContacts } from '../../services/geminiService';
import Spinner from '../ui/Spinner';
import useLocalStorage from '../hooks/useLocalStorage';

// Modal component for adding/editing contacts
const ContactModal: React.FC<{
  contact: Contact | null;
  onSave: (contact: Contact) => void;
  onClose: () => void;
}> = ({ contact, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Contact, 'id'>>({
    name: '',
    email: '',
    type: 'Fan',
    tags: []
  });

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name,
        email: contact.email,
        type: contact.type,
        tags: contact.tags
      });
    } else {
      setFormData({ name: '', email: '', type: 'Fan', tags: [] });
    }
  }, [contact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
      setFormData(prev => ({...prev, tags}));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalContact: Contact = {
        id: contact?.id || Date.now().toString(),
        ...formData
    };
    onSave(finalContact);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in-fast">
      <Card className="w-full max-w-md bg-gray-800 border-gray-600" title={contact ? 'Edit Contact' : 'Add New Contact'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-gray-200" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-gray-200" />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-300">Type</label>
            <select id="type" name="type" value={formData.type} onChange={handleChange} className="mt-1 w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-gray-200">
              <option>Fan</option>
              <option>Media</option>
              <option>Influencer</option>
              <option>Curator</option>
            </select>
          </div>
           <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-300">Tags (comma-separated)</label>
            <input type="text" id="tags" name="tags" value={formData.tags.join(', ')} onChange={handleTagsChange} className="mt-1 w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-gray-200" />
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600">Cancel</button>
            <Button type="submit">Save Contact</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};


const CRMView: React.FC = () => {
  const [contacts, setContacts] = useLocalStorage<Contact[]>('crm_contacts', []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('indie-folk musician');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const handleGenerateContacts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateContacts(prompt);
      // Append new contacts to existing ones, avoiding duplicates by ID
      setContacts(prev => {
          const existingIds = new Set(prev.map(c => c.id));
          const newContacts = result.filter(c => !existingIds.has(c.id));
          return [...prev, ...newContacts];
      });
    } catch (e) {
      setError('Failed to generate contacts.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, setContacts]);

  const handleOpenModal = (contact: Contact | null) => {
      setEditingContact(contact);
      setIsModalOpen(true);
  }

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingContact(null);
  }
  
  const handleSaveContact = (contactToSave: Contact) => {
      setContacts(prevContacts => {
          const exists = prevContacts.some(c => c.id === contactToSave.id);
          if (exists) {
              return prevContacts.map(c => c.id === contactToSave.id ? contactToSave : c);
          } else {
              return [...prevContacts, contactToSave];
          }
      });
      handleCloseModal();
  }

  const handleDeleteContact = (contactId: string) => {
      if(window.confirm('Are you sure you want to delete this contact?')) {
          setContacts(prev => prev.filter(c => c.id !== contactId));
      }
  }

  const getTagColor = (tag: string) => {
    const colors = ['bg-blue-600', 'bg-green-600', 'bg-yellow-600', 'bg-purple-600', 'bg-pink-600'];
    const hash = tag.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return colors[hash % colors.length];
  };

  return (
    <>
      {isModalOpen && <ContactModal contact={editingContact} onSave={handleSaveContact} onClose={handleCloseModal} />}
      <div className="animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">CRM</h1>
        <p className="text-lg text-gray-400 mb-6">Manage your contacts and industry relationships.</p>

        <Card>
          <div className="flex flex-col sm:flex-row gap-4">
              <input 
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe your niche, e.g., sci-fi author"
              />
              <div className="flex gap-4 w-full sm:w-auto">
                 <Button onClick={handleGenerateContacts} isLoading={isLoading} className="w-full sm:w-auto flex-shrink-0">
                      Generate Samples
                  </Button>
                  <Button onClick={() => handleOpenModal(null)} className="w-full sm:w-auto flex-shrink-0 bg-green-600 hover:bg-green-700">
                      Add Contact
                  </Button>
              </div>
          </div>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </Card>

        <div className="mt-6">
          {isLoading && contacts.length === 0 ? (
              <div className="text-center p-8"><Spinner /></div>
          ) : contacts.length > 0 ? (
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-gray-700 text-sm text-gray-400">
                    <tr>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Tags</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr key={contact.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="p-3 font-medium text-white">{contact.name}</td>
                        <td className="p-3 text-gray-300">{contact.email}</td>
                        <td className="p-3 text-indigo-400">{contact.type}</td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {contact.tags.map(tag => (
                              <span key={tag} className={`px-2 py-0.5 text-xs rounded-full text-white ${getTagColor(tag)}`}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                            <button onClick={() => handleOpenModal(contact)} className="text-sm font-medium text-indigo-400 hover:text-indigo-300 mr-4">Edit</button>
                            <button onClick={() => handleDeleteContact(contact.id)} className="text-sm font-medium text-red-400 hover:text-red-300">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
              <Card>
                  <p className="text-center text-gray-400">No contacts to display. Add a contact or generate samples to get started.</p>
              </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default CRMView;