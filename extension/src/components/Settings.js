import React, { useState } from 'react';
import { updatePreferences } from '../utils/api';

/**
 * Manages user settings for blocked sites.
 * @param {object} props - Component props.
 * @param {string} props.token - The user's auth token.
 * @param {object} props.currentPreferences - The current user preferences.
 * @param {function} props.onUpdate - Callback to trigger after preferences are updated.
 */
const Settings = ({ token, currentPreferences, onUpdate }) => {
  const [blockedSites, setBlockedSites] = useState(currentPreferences.blockedSites || []);
  const [newSite, setNewSite] = useState('');
  const [error, setError] = useState('');

  const handleAddSite = async () => {
    const siteToAdd = newSite.trim().toLowerCase();
    if (!siteToAdd || blockedSites.includes(siteToAdd)) {
      setError('Please enter a valid, unique domain (e.g., example.com)');
      return;
    }
    setError('');
    const updatedSites = [...blockedSites, siteToAdd];
    try {
      await updatePreferences(token, { blockedSites: updatedSites });
      setBlockedSites(updatedSites);
      setNewSite('');
      onUpdate(); // Notify dashboard to refetch and update storage
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveSite = async (siteToRemove) => {
    const updatedSites = blockedSites.filter(site => site !== siteToRemove);
    try {
      await updatePreferences(token, { blockedSites: updatedSites });
      setBlockedSites(updatedSites);
      onUpdate();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h3>Blocked Websites</h3>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          value={newSite}
          onChange={(e) => setNewSite(e.target.value)}
          placeholder="e.g., facebook.com"
        />
        <button onClick={handleAddSite} className="btn btn-primary" style={{width: "auto"}}>+</button>
      </div>
      {error && <p className="error">{error}</p>}
      <ul className="blocked-site-list">
        {blockedSites.map(site => (
          <li key={site} className="blocked-site-item">
            {site}
            <button onClick={() => handleRemoveSite(site)} className="remove-btn">
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Settings;