// API Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCrpu2LQkHr5byIdZQiBlUpKvXZ';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// DOM Elements
const hamburgerBtn = document.getElementById('hamburgerBtn');
const fullscreenMenu = document.getElementById('fullscreenMenu');
const closeMenuBtn = document.getElementById('closeMenuBtn');

// Notification Elements
const notificationBtn = document.getElementById('notificationBtn');
const alertBtn = document.getElementById('alertBtn');

// Dark Mode Elements
const darkModeToggle = document.getElementById('darkModeToggle');

// AI Chat Elements
const aiChatInterface = document.getElementById('aiChatInterface');
const chatBackBtn = document.getElementById('chatBackBtn');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

// Profile Elements
const profileInterface = document.getElementById('profileInterface');
const profileBackBtn = document.getElementById('profileBackBtn');

// Map Elements
const mapInterface = document.getElementById('mapInterface');
const mapBackBtn = document.getElementById('mapBackBtn');
const currentLocationBtn = document.getElementById('currentLocationBtn');
const searchToggleBtn = document.getElementById('searchToggleBtn');
const searchContainer = document.getElementById('searchContainer');
const searchCloseBtn = document.getElementById('searchCloseBtn');
const mapSearchInput = document.getElementById('mapSearchInput');
const mapLoading = document.getElementById('mapLoading');
const mapInfoPanel = document.getElementById('mapInfoPanel');
const selectedLocationName = document.getElementById('selectedLocationName');
const selectedLocationAddress = document.getElementById('selectedLocationAddress');
const directionsBtn = document.getElementById('directionsBtn');
const shareLocationBtn = document.getElementById('shareLocationBtn');

// Global Variables
let isTyping = false;
let chatHistory = [];
let map = null;
let currentLocationMarker = null;
let selectedMarker = null;
let userLocation = null;
let currentNotificationPopup = null;
let isDarkMode = false;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        enableDarkMode();
    }
    
    // Initialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Set up status bar time
    updateStatusBarTime();
    setInterval(updateStatusBarTime, 60000); // Update every minute
    
    // Set up event listeners
    setupEventListeners();
    
    console.log('Rahi Travel App initialized successfully');
}

function updateStatusBarTime() {
    const statusTime = document.querySelector('.status-time');
    if (statusTime) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: false
        });
        statusTime.textContent = timeString;
    }
}

// ========================
// DARK MODE FUNCTIONS
// ========================

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    document.querySelector('.app-container')?.classList.add('dark-mode');
    isDarkMode = true;
    
    // Update dark mode icon
    const darkModeIcon = darkModeToggle?.querySelector('i');
    if (darkModeIcon) {
        darkModeIcon.setAttribute('data-lucide', 'sun');
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    document.querySelector('.app-container')?.classList.remove('dark-mode');
    isDarkMode = false;
    
    // Update dark mode icon
    const darkModeIcon = darkModeToggle?.querySelector('i');
    if (darkModeIcon) {
        darkModeIcon.setAttribute('data-lucide', 'moon');
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

// ========================
// NOTIFICATION FUNCTIONS
// ========================

function showNotifications() {
    // Remove existing popup if any
    hideNotifications();
    
    const notifications = [
        {
            title: "Safety Alert",
            message: "High tourist activity detected in your area. Stay vigilant.",
            time: "2 mins ago",
            type: "warning"
        },
        {
            title: "Weather Update",
            message: "Light rain expected this evening. Plan accordingly.",
            time: "1 hour ago",
            type: "info"
        },
        {
            title: "Community",
            message: "3 Rahi users are nearby and available for assistance.",
            time: "3 hours ago",
            type: "success"
        }
    ];
    
    const popup = document.createElement('div');
    popup.className = 'notification-popup';
    popup.id = 'notificationPopup';
    
    let notificationHTML = `
        <div class="notification-header">
            <div class="notification-title">Notifications</div>
            <button class="notification-close" onclick="hideNotifications()">
                <i data-lucide="x"></i>
            </button>
        </div>
    `;
    
    notifications.forEach(notification => {
        notificationHTML += `
            <div class="notification-item">
                <div class="notification-content">
                    <strong>${notification.title}</strong><br>
                    ${notification.message}
                    <div style="font-size: 12px; color: #9CA3AF; margin-top: 4px;">
                        ${notification.time}
                    </div>
                </div>
            </div>
        `;
    });
    
    popup.innerHTML = notificationHTML;
    document.body.appendChild(popup);
    
    // Trigger animation
    setTimeout(() => {
        popup.classList.add('active');
    }, 10);
    
    // Initialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    currentNotificationPopup = popup;
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        hideNotifications();
    }, 10000);
}

function hideNotifications() {
    if (currentNotificationPopup) {
        currentNotificationPopup.classList.remove('active');
        setTimeout(() => {
            if (currentNotificationPopup && document.body.contains(currentNotificationPopup)) {
                document.body.removeChild(currentNotificationPopup);
            }
            currentNotificationPopup = null;
        }, 300);
    }
}

// ========================
// ALERT FUNCTIONS
// ========================

function showAlert() {
    const alertOverlay = document.createElement('div');
    alertOverlay.className = 'alert-overlay';
    alertOverlay.id = 'alertOverlay';
    
    alertOverlay.innerHTML = `
        <div class="alert-modal">
            <div class="alert-icon">
                <i data-lucide="alert-triangle"></i>
            </div>
            <div class="alert-title">Emergency Alert</div>
            <div class="alert-message">
                Are you in immediate danger or need emergency assistance? This will notify local authorities and nearby Rahi users.
            </div>
            <div class="alert-actions">
                <button class="alert-btn-secondary" onclick="hideAlert()">Cancel</button>
                <button class="alert-btn-primary" onclick="confirmAlert()">Send Alert</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(alertOverlay);
    
    // Trigger animation
    setTimeout(() => {
        alertOverlay.classList.add('active');
    }, 10);
    
    // Initialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function hideAlert() {
    const alertOverlay = document.getElementById('alertOverlay');
    if (alertOverlay) {
        alertOverlay.classList.remove('active');
        setTimeout(() => {
            if (document.body.contains(alertOverlay)) {
                document.body.removeChild(alertOverlay);
            }
            document.body.style.overflow = '';
        }, 300);
    }
}

function confirmAlert() {
    hideAlert();
    
    // Simulate alert sending
    showNotificationPopup("Emergency alert sent to authorities and nearby users!", "success");
    
    // You would implement actual emergency alert logic here
    console.log('Emergency alert sent!');
}

function showNotificationPopup(message, type = 'info') {
    const colors = {
        success: '#10B981',
        info: '#3B82F6',
        warning: '#F59E0B',
        error: '#EF4444'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: ${colors[type]};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        opacity: 0;
        transition: all 0.3s ease;
        max-width: 300px;
        text-align: center;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(10px)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-10px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ========================
// MENU FUNCTIONS
// ========================

function openFullscreenMenu() {
    if (fullscreenMenu) {
        fullscreenMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeFullscreenMenu() {
    if (fullscreenMenu) {
        fullscreenMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function handleMenuClick(action) {
    console.log('Menu item clicked:', action);
    
    if (action === 'ai-chat') {
        openAIChat();
        return;
    }
    
    if (action === 'profile') {
        openProfile();
        return;
    }
    
    if (action === 'map') {
        openMap();
        return;
    }
    
    closeFullscreenMenu();
    
    switch (action) {
        case 'safety-score':
            console.log('Navigating to Safety Score');
            showNotificationPopup('Safety Score feature coming soon!');
            break;
        case 'community':
            console.log('Navigating to Community');
            showNotificationPopup('Community feature coming soon!');
            break;
        case 'planner':
            console.log('Navigating to Travel Planner');
            showNotificationPopup('Travel Planner feature coming soon!');
            break;
        case 'sos':
            console.log('Navigating to SOS');
            showAlert();
            break;
        case 'help-desk':
            console.log('Navigating to Help Desk');
            showNotificationPopup('Help Desk feature coming soon!');
            break;
        case 'settings':
            console.log('Navigating to Settings');
            showNotificationPopup('Settings feature coming soon!');
            break;
        default:
            console.log('Unknown action:', action);
    }
}

// ========================
// AI CHAT FUNCTIONS
// ========================

function openAIChat() {
    closeFullscreenMenu();
    if (aiChatInterface) {
        aiChatInterface.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (chatInput) {
            chatInput.focus();
        }
    }
}

function closeAIChat() {
    if (aiChatInterface) {
        aiChatInterface.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function scrollToBottom() {
    setTimeout(() => {
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }, 100);
}

function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function addMessage(content, isUser = false) {
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;
    messageDiv.innerHTML = `
        <div class="message-bubble">${content}</div>
        <div class="message-time">${formatTime()}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function showTypingIndicator() {
    if (isTyping || !chatMessages) return;
    
    isTyping = true;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
        <span style="font-size: 12px; color: #9CA3AF;">AI is typing...</span>
    `;
    
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

function hideTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

async function sendToGemini(message) {
    try {
        const requestBody = {
            contents: [{
                parts: [{
                    text: `You are a helpful travel assistant for the Rahi app. Keep responses under 150 words and helpful for travelers. User message: ${message}`
                }]
            }]
        };

        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Extract response text from various possible response formats
        let aiText = null;
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            aiText = data.candidates[0].content.parts[0].text;
        } else if (data?.candidates?.[0]?.output) {
            aiText = data.candidates[0].output;
        } else if (data?.text) {
            aiText = data.text;
        } else {
            console.log('Full API response:', JSON.stringify(data, null, 2));
            throw new Error('Could not extract text from response');
        }
        
        return aiText;
    } catch (error) {
        console.error('API Error:', error);
        return "I'm having trouble connecting to the AI service right now. Please try again in a moment. Error: " + error.message;
    }
}

async function handleSendMessage() {
    const message = chatInput?.value.trim();
    if (!message || isTyping) return;
    
    // Add user message
    addMessage(message, true);
    chatInput.value = '';
    updateSendButton();
    
    // Show typing indicator
    showTypingIndicator();
    
    // Get AI response
    const aiResponse = await sendToGemini(message);
    
    // Hide typing indicator and add AI response
    hideTypingIndicator();
    addMessage(aiResponse);
}

function updateSendButton() {
    if (!chatInput || !sendBtn) return;
    
    const hasText = chatInput.value.trim().length > 0;
    sendBtn.disabled = !hasText || isTyping;
}

// ========================
// PROFILE FUNCTIONS
// ========================

function openProfile() {
    closeFullscreenMenu();
    if (profileInterface) {
        profileInterface.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeProfile() {
    if (profileInterface) {
        profileInterface.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ========================
// GOOGLE MAPS FUNCTIONS
// ========================

function openMap() {
    closeFullscreenMenu();
    if (mapInterface) {
        mapInterface.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        if (!map) {
            if (typeof google !== 'undefined' && google.maps) {
                initializeMap();
            } else {
                console.error('Google Maps API not loaded');
                showNotificationPopup('Map service is not available. Please check your internet connection.', 'error');
            }
        }
    }
}

function closeMap() {
    if (mapInterface) {
        mapInterface.classList.remove('active');
        document.body.style.overflow = '';
        closeMapSearch();
        if (mapInfoPanel) {
            mapInfoPanel.classList.remove('active');
        }
    }
}

function toggleMapSearch() {
    if (searchContainer) {
        searchContainer.classList.toggle('active');
        if (searchContainer.classList.contains('active')) {
            if (mapSearchInput) {
                mapSearchInput.focus();
            }
        }
    }
}

function closeMapSearch() {
    if (searchContainer) {
        searchContainer.classList.remove('active');
        if (mapSearchInput) {
            mapSearchInput.value = '';
        }
    }
}

function initializeMap() {
    try {
        // Default location (Mumbai)
        const defaultLocation = { lat: 19.0760, lng: 72.8777 };
        
        const mapOptions = {
            zoom: 12,
            center: defaultLocation,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            }
        };
        
        map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
        
        // Hide loading indicator
        if (mapLoading) {
            mapLoading.style.display = 'none';
        }
        
        // Add click listener to map
        map.addListener('click', function(event) {
            handleMapClick(event.latLng);
        });
        
        // Get user's current location
        getCurrentLocation();
        
    } catch (error) {
        console.error('Error initializing map:', error);
        if (mapLoading) {
            mapLoading.innerHTML = '<div class="loading-text">Error loading map</div>';
        }
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                
                if (map) {
                    map.setCenter(userLocation);
                    map.setZoom(15);
                    
                    // Remove existing marker
                    if (currentLocationMarker) {
                        currentLocationMarker.setMap(null);
                    }
                    
                    // Add user location marker
                    currentLocationMarker = new google.maps.Marker({
                        position: userLocation,
                        map: map,
                        title: 'Your Location',
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: '#4F46E5',
                            fillOpacity: 1,
                            strokeColor: '#fff',
                            strokeWeight: 2
                        }
                    });
                }
            },
            function(error) {
                console.log('Geolocation error:', error.message);
            }
        );
    }
}

function handleMapClick(latLng) {
    // Remove existing selected marker
    if (selectedMarker) {
        selectedMarker.setMap(null);
    }
    
    // Add new marker at clicked location
    selectedMarker = new google.maps.Marker({
        position: latLng,
        map: map,
        title: 'Selected Location'
    });
    
    // Reverse geocode to get place information
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, function(results, status) {
        if (status === 'OK' && results[0]) {
            const place = results[0];
            
            if (selectedLocationName && selectedLocationAddress && mapInfoPanel) {
                selectedLocationName.textContent = getLocationName(place);
                selectedLocationAddress.textContent = place.formatted_address;
                mapInfoPanel.classList.add('active');
            }
        }
    });
}

function getLocationName(place) {
    // Try to get a meaningful place name
    for (let component of place.address_components) {
        if (component.types.includes('establishment') || 
            component.types.includes('point_of_interest') || 
            component.types.includes('premise')) {
            return component.long_name;
        }
    }
    return place.address_components[0]?.long_name || 'Selected Location';
}

function searchPlaces() {
    const query = mapSearchInput?.value.trim();
    if (!query || !map) return;
    
    const service = new google.maps.places.PlacesService(map);
    const request = {
        query: query,
        fields: ['name', 'geometry', 'formatted_address']
    };
    
    service.textSearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
            const place = results[0];
            
            // Center map on the place
            map.setCenter(place.geometry.location);
            map.setZoom(16);
            
            // Remove existing marker
            if (selectedMarker) {
                selectedMarker.setMap(null);
            }
            
            // Add marker for the place
            selectedMarker = new google.maps.Marker({
                position: place.geometry.location,
                map: map,
                title: place.name
            });
            
            // Update info panel
            if (selectedLocationName && selectedLocationAddress && mapInfoPanel) {
                selectedLocationName.textContent = place.name;
                selectedLocationAddress.textContent = place.formatted_address;
                mapInfoPanel.classList.add('active');
            }
            
            closeMapSearch();
        }
    });
}

// ========================
// EVENT LISTENERS
// ========================

function setupEventListeners() {
    // Menu event listeners
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            openFullscreenMenu();
        });
    }
    
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeFullscreenMenu();
        });
    }
    
    // Notification and Alert event listeners
    if (notificationBtn) {
        notificationBtn.addEventListener('click', showNotifications);
    }
    
    if (alertBtn) {
        alertBtn.addEventListener('click', showAlert);
    }
    
    // Dark Mode event listener
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // AI Chat event listeners
    if (chatBackBtn) {
        chatBackBtn.addEventListener('click', closeAIChat);
    }
    
    if (chatInput) {
        chatInput.addEventListener('input', updateSendButton);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });
    }
    
    if (sendBtn) {
        sendBtn.addEventListener('click', handleSendMessage);
    }
    
    // Profile event listeners
    if (profileBackBtn) {
        profileBackBtn.addEventListener('click', closeProfile);
    }
    
    // Map event listeners
    if (mapBackBtn) {
        mapBackBtn.addEventListener('click', closeMap);
    }
    
    if (currentLocationBtn) {
        currentLocationBtn.addEventListener('click', getCurrentLocation);
    }
    
    if (searchToggleBtn) {
        searchToggleBtn.addEventListener('click', toggleMapSearch);
    }
    
    if (searchCloseBtn) {
        searchCloseBtn.addEventListener('click', closeMapSearch);
    }
    
    if (mapSearchInput) {
        mapSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchPlaces();
            }
        });
    }
    
    if (directionsBtn) {
        directionsBtn.addEventListener('click', function() {
            if (selectedMarker) {
                const pos = selectedMarker.getPosition();
                const url = `https://www.google.com/maps/dir/?api=1&destination=${pos.lat()},${pos.lng()}`;
                window.open(url, '_blank');
            }
        });
    }
    
    if (shareLocationBtn) {
        shareLocationBtn.addEventListener('click', function() {
            if (selectedMarker) {
                const pos = selectedMarker.getPosition();
                const url = `https://www.google.com/maps/search/?api=1&query=${pos.lat()},${pos.lng()}`;
                
                if (navigator.share) {
                    navigator.share({
                        title: 'Location from Rahi',
                        url: url
                    });
                } else {
                    navigator.clipboard.writeText(url).then(function() {
                        showNotificationPopup('Location link copied to clipboard!', 'success');
                    });
                }
            }
        });
    }
    
    // Global escape key handler
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (currentNotificationPopup) {
                hideNotifications();
            } else if (document.getElementById('alertOverlay')) {
                hideAlert();
            } else if (mapInterface?.classList.contains('active')) {
                closeMap();
            } else if (profileInterface?.classList.contains('active')) {
                closeProfile();
            } else if (aiChatInterface?.classList.contains('active')) {
                closeAIChat();
            } else if (fullscreenMenu?.classList.contains('active')) {
                closeFullscreenMenu();
            }
        }
    });
    
    // Click outside to close notifications
    document.addEventListener('click', function(e) {
        if (currentNotificationPopup && !currentNotificationPopup.contains(e.target) && e.target !== notificationBtn) {
            hideNotifications();
        }
    });
    
    // Menu delegation for dynamic content
    document.addEventListener('click', function(e) {
        const menuItem = e.target.closest('[onclick*="handleMenuClick"]');
        if (menuItem) {
            const onclick = menuItem.getAttribute('onclick');
            const action = onclick.match(/handleMenuClick\(['"]([^'"]+)['"]\)/);
            if (action) {
                e.preventDefault();
                handleMenuClick(action[1]);
            }
        }
    });
}

// Global functions for HTML onclick handlers
function handleAIChat() {
    openAIChat();
}

// Initialize when Google Maps API is loaded
window.initMap = function() {
    console.log('Google Maps API loaded successfully');
    if (map && mapInterface?.classList.contains('active')) {
        initializeMap();
    }
};

// Expose functions globally for HTML onclick handlers
window.handleMenuClick = handleMenuClick;
window.handleAIChat = handleAIChat;
window.hideNotifications = hideNotifications;
window.hideAlert = hideAlert;
window.confirmAlert = confirmAlert;
window.openProfile = openProfile;
window.openMap = openMap;
