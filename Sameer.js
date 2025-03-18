// script.js
let scheduler = null;
let stopKey = null;
const config = {
    delay: {
        seconds: 0
    },
    accounts: [],
    chatTargets: [],
    messages: []
};

function generateStopKey() {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
}

function startScheduler() {
    // Get configuration values
    config.delay.seconds = parseInt(document.getElementById('delaySeconds').value);
    
    stopKey = generateStopKey();
    document.getElementById('stopKey').innerHTML = `<i class="fas fa-key stop-key-icon"></i> Stop Key: ${stopKey}`;
    
    // Load accounts, chat targets, and messages from files
    const accountsFile = document.getElementById('accountsFile').files[0];
    const chatTargetsFile = document.getElementById('chatTargetsFile').files[0];
    const messagesFile = document.getElementById('messagesFile').files[0];

    const accountsReader = new FileReader();
    accountsReader.onload = function(e) {
        config.accounts = parseAccounts(e.target.result);
        loadChatTargets(chatTargetsFile, messagesFile);
    };
    accountsReader.readAsText(accountsFile);
}

function parseAccounts(content) {
    return content.split('\n').map(line => {
        const parts = line.split(':');
        return {
            id: parts[0],
            password: parts[1],
            type: parts[2] // Can be 'uid', 'username', or 'gmail'
        };
    });
}

function loadChatTargets(file, messagesFile) {
    const reader = new FileReader();
    reader.onload = function(e) {
        config.chatTargets = e.target.result.split('\n');
        loadMessages(messagesFile);
    };
    reader.readAsText(file);
}

function loadMessages(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        config.messages = e.target.result.split('\n');
        scheduleMessages();
    };
    reader.readAsText(file);
}

function scheduleMessages() {
    let delay = config.delay.seconds * 1000;
    let counter = 0;

    scheduler = setInterval(() => {
        const account = config.accounts[counter % config.accounts.length];
        const chatTarget = config.chatTargets[counter % config.chatTargets.length];
        const message = config.messages[Math.floor(Math.random() * config.messages.length)];
        
        sendMessage(account, chatTarget, message);
        counter++;
    }, delay);
}

function sendMessage(account, chatTarget, message) {
    const encrypted = CryptoJS.AES.encrypt(message, account.id).toString();
    const timestamp = new Date().toISOString();
    
    // Display in terminal
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    
    logEntry.innerHTML = `
        <i class="fas fa-paper-plane log-icon"></i>
        <span class="timestamp">${timestamp}</span>
        <span class="account-info">Account: ${account.type}:${account.id}</span>
        <span class="message-info">Target: ${chatTarget} | Message: ${encrypted}</span>
    `;
    
    // Apply colorful text effect to log entry
    const words = logEntry.textContent.split(' ');
    logEntry.innerHTML = '';
    words.forEach(word => {
        const wordSpan = document.createElement('span');
        wordSpan.style.color = getRandomColor();
        wordSpan.textContent = word + ' ';
        logEntry.appendChild(wordSpan);
    });
    
    document.getElementById('chatLog').appendChild(logEntry);
    
    // Simulated Facebook API call
    console.log(`Simulated send: ${timestamp} | Account: ${account.type}:${account.id} | Target: ${chatTarget} | Message: ${encrypted}`);
}

function getRandomColor() {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3', '#33FFF3'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function stopScheduler() {
    clearInterval(scheduler);
    alert('Scheduler stopped');
}
