import React, { useState, useEffect, useCallback } from 'react';
import Reports from './Reports';
import Settings from './Settings';
import { getPreferences } from '../utils/api';

/**
 * The main dashboard component shown after login.
 * @param {object} props - Component props.
 * @param {function} props.onLogout - Callback function to handle logout.
 * @param {string} props.token - The user's auth token.
 */
const Dashboard = ({ onLogout, token }) => {
  const [activeTab, setActiveTab] = useState('reports');
  const [preferences, setPreferences] = useState({ blockedSites: [] });

  const fetchAndStorePreferences = useCallback(async () => {
    try {
      const prefs = await getPreferences(token);
      setPreferences(prefs);
      // Store preferences in local storage for the background script to access
      await window.chrome.storage.local.set({ preferences: prefs });
      // Notify the background script that rules may have changed
      window.chrome.runtime.sendMessage({ action: 'updateBlocking' });
    } catch (error) {
      console.error(error.message);
      // Automatically log out if token is invalid or expired
      if (error.message.includes('401') || error.message.includes('Failed')) {
        onLogout();
      }
    }
  }, [token, onLogout]);

  useEffect(() => {
    fetchAndStorePreferences();
  }, [fetchAndStorePreferences]);

  return (
    <div>
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
        <button
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {activeTab === 'reports' && <Reports token={token} />}
      {activeTab === 'settings' && (
        <Settings
          token={token}
          currentPreferences={preferences}
          onUpdate={fetchAndStorePreferences} // Refetch preferences on update
        />
      )}
      
      <br/>
      <button onClick={onLogout} className="btn btn-danger">
        Logout
      </button>
    </div>
  );
};

export default Dashboard;