const path = require('path');
const fs = require('fs');
const os = require('os');

let userDataPath = undefined
switch (process.platform) {
	case 'win32':
		userDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'Launchdeck');
		break;
	case 'darwin':
		userDataPath = path.join(os.homedir(), 'Library', 'Application Support', 'Launchdeck');
		break;
	case 'linux':
		userDataPath = path.join(os.homedir(), '.config', 'Launchdeck');
		break;
}

if(!fs.existsSync(userDataPath)) {
	fs.mkdirSync(userDataPath);
}

const settingsPath = path.join(userDataPath, 'settings.json');

const defaultSettings = {
	"apps": [
		{
			"id": "Twitch",
			"url": "https://twitch.tv",
			"image": `file://${__dirname}/assets/images/twitch.png`
		},
		{
			"id": "Netflix",
			"url": "https://netflix.com/browse",
			"image": `file://${__dirname}/assets/images/netflix.png`
		},
		{
			"id": "Plex",
			"url": "https://app.plex.tv",
			"image": `file://${__dirname}/assets/images/plex.png`
		},
		{
			"id": "YouTube",
			"url": "https://youtube.com",
			"image": `file://${__dirname}/assets/images/youtube.png`
		},
		{
			"id": "YouTube Music",
			"url": "https://music.youtube.com",
			"image": `file://${__dirname}/assets/images/youtubemusic.png`
		},
		{
			"id": "Reddit",
			"url": "https://reddit.com",
			"image": `file://${__dirname}/assets/images/reddit.png`
		},
		{
			"id": "WhatsApp",
			"url": "https://whatsapp.com",
			"image": `file://${__dirname}/assets/images/whatsapp.png`
		}
	]
};

function getSetting(key) {
	if (!fs.existsSync(settingsPath)) {
		fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings));
	}
	return JSON.parse(fs.readFileSync(settingsPath))[key];
}

function setSetting(key, value) {
	if (!fs.existsSync(settingsPath)) {
		fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings));
	}
	fs.writeFileSync(settingsPath, JSON.stringify({
		...JSON.parse(fs.readFileSync(settingsPath)),
		[key]: value
	}));
}

module.exports = {
	getSetting,
	setSetting
};