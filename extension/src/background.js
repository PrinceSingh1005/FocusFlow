/* global chrome */

const API_URL = 'http://localhost:5000/api';
let activeTabInfo = {
    tabId: null,
    startTime: null,
    domain: null,
};

// --- Time Tracking ---
async function startTracking(tabId, url) {
    if (!url || !url.startsWith('http')) {
        activeTabInfo = { tabId: null, startTime: null, domain: null };
        return;
    }
    const domain = new URL(url).hostname;
    activeTabInfo = { tabId, startTime: Date.now(), domain };
}

async function stopTracking() {
    if (activeTabInfo.startTime && activeTabInfo.domain) {
        const endTime = Date.now();
        const timeSpent = Math.round((endTime - activeTabInfo.startTime) / 1000); // in seconds
        if (timeSpent > 0) {
            const { local } = await chrome.storage.local.get('timeLogs');
            const timeLogs = local?.timeLogs || {};
            timeLogs[activeTabInfo.domain] = (timeLogs[activeTabInfo.domain] || 0) + timeSpent;
            await chrome.storage.local.set({ timeLogs });
        }
    }
    activeTabInfo = { tabId: null, startTime: null, domain: null };
}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    await stopTracking();
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab && tab.url) {
        startTracking(activeInfo.tabId, tab.url);
    }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (tabId === activeTabInfo.tabId && changeInfo.url) {
        await stopTracking();
        startTracking(tabId, changeInfo.url);
    }
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
    await stopTracking();
    if (windowId !== chrome.windows.WINDOW_ID_NONE) {
        const [tab] = await chrome.tabs.query({ active: true, windowId });
        if (tab) {
            startTracking(tab.id, tab.url);
        }
    }
});

chrome.idle.onStateChanged.addListener(async (newState) => {
    if (newState === 'idle' || newState === 'locked') {
        await stopTracking();
    } else if (newState === 'active') {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab) {
            startTracking(tab.id, tab.url);
        }
    }
});

// --- Site Blocking (Declarative Net Request) ---
async function updateBlockingRules() {
    const { token, preferences } = await chrome.storage.local.get(['token', 'preferences']);
    if (!token || !preferences?.blockedSites) {
        await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [1] });
        return;
    }

    const blockedSites = preferences.blockedSites;
    if (blockedSites.length === 0) {
        await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [1] });
        return;
    }

    const newRule = {
        id: 1,
        priority: 1,
        action: { type: 'block' },
        condition: {
            "urlFilter": `||${blockedSites.join('^||')}^`,
            "resourceTypes": ["main_frame"]
        },
    };
    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1],
        addRules: [newRule],
    });
}

// --- Data Syncing ---
async function syncData() {
    const { token, timeLogs } = await chrome.storage.local.get(['token', 'timeLogs']);
    if (!token || !timeLogs || Object.keys(timeLogs).length === 0) {
        return;
    }

    const logsToSend = Object.entries(timeLogs).map(([domain, timeSpent]) => ({
        domain,
        timeSpent,
    }));

    try {
        const response = await fetch(`${API_URL}/time-logs/sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
            body: JSON.stringify({ logs: logsToSend }),
        });

        if (response.ok) {
            await chrome.storage.local.remove('timeLogs');
        }
    } catch (error) {
        console.error('Failed to sync data:', error);
    }
}

// --- Alarms ---
chrome.alarms.create('syncAlarm', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'syncAlarm') {
        syncData();
    }
});

// --- Listen for messages from popup ---
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateBlocking') {
        updateBlockingRules();
    }
    // This allows async sendResponse
    return true;
});

// --- Initial Setup on Install/Update ---
chrome.runtime.onInstalled.addListener(() => {
    console.log('FocusFlow extension installed.');
    updateBlockingRules();
});