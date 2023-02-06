//Load the apps from the settings file
const { getSetting } = require('../settingsHandler.js');
const appList = getSetting('apps');

const appContainer = document.querySelector('.apps');
appList.forEach((app) => {
	const appElement = document.createElement('div');
	appElement.classList.add('app');
	appElement.id = app.id;
	appElement.innerHTML = `
		<a href="${app.url}">
			<img src="${app.image}">
		</a>
	`;
	appContainer.appendChild(appElement);
});

//Miscellaneous
window.addEventListener("auxclick", (event) => {
  if (event.button === 1) event.preventDefault();
});

// Keyboard and Gamepad navigation
const apps = document.querySelectorAll('.app');
let selectedApp = 0;

document.addEventListener('keydown', (event) => {
	apps[selectedApp].classList.add('selected');
	switch (event.key) {
		case 'ArrowLeft':
			if (selectedApp > 0 && selectedApp % 6 !==0) {
				apps[selectedApp].classList.remove('selected');
				selectedApp--;
				apps[selectedApp].classList.add('selected');
			}
			break;
		case 'ArrowRight':
			if (selectedApp < apps.length - 1 && selectedApp % 6 !==5) {
				apps[selectedApp].classList.remove('selected');
				selectedApp++;
				apps[selectedApp].classList.add('selected');
			}
			break;
		case 'ArrowUp':
			if (selectedApp - 6 >= 0) {
				apps[selectedApp].classList.remove('selected');
				selectedApp -= 6;
				apps[selectedApp].classList.add('selected');
		if (selectedApp-6 <= 0) {
			scrollTo(0, 0)
		} else scrollTo(0, apps[selectedApp-6].offsetTop)
			}
			break;
		case 'ArrowDown':
			if (selectedApp + 6 <= apps.length - 1) {
				apps[selectedApp].classList.remove('selected');
				selectedApp += 6;
				apps[selectedApp].classList.add('selected');
		if (apps[selectedApp+6] && selectedApp+6 <= apps.length - 1) {
			scrollTo(0, apps[selectedApp+6].offsetTop-apps[selectedApp+6].offsetHeight*2)
		} else scrollTo(0, apps[selectedApp].offsetTop+apps[selectedApp].offsetHeight*2)
			}
			break;
		case 'Enter':
			apps[selectedApp].querySelector('a').click();
			break;
	}
});

//Gamepad navigation
window.addEventListener('gamepadconnected', (event) => {
	const gamepad = event.gamepad;
	setInterval(() => {
		const gamepad = navigator.getGamepads()[0];
		if (gamepad.axes[0] < -0.5) {
			if (selectedApp > 0 && selectedApp % 6 !==0) {
				apps[selectedApp].classList.remove('selected');
				selectedApp--;
				apps[selectedApp].classList.add('selected');
			} else apps[selectedApp].classList.add('selected');
		}
		if (gamepad.axes[0] > 0.5) {
			if (selectedApp < apps.length - 1 && selectedApp % 6 !==5) {
				apps[selectedApp].classList.remove('selected');
				selectedApp++;
				apps[selectedApp].classList.add('selected');
			} else apps[selectedApp].classList.add('selected');
		}
		if (gamepad.axes[1] < -0.5) {
			if (selectedApp - 6 >= 0) {
				apps[selectedApp].classList.remove('selected');
				selectedApp -= 6;
				apps[selectedApp].classList.add('selected');
				if (selectedApp-6 <= 0) {
					scrollTo(0, 0)
				} else scrollTo(0, apps[selectedApp-6].offsetTop)
			} else apps[selectedApp].classList.add('selected');
		}
		if (gamepad.axes[1] > 0.5) {
			if (selectedApp + 6 <= apps.length - 1) {
				apps[selectedApp].classList.remove('selected');
				selectedApp += 6;
				apps[selectedApp].classList.add('selected');
				if (apps[selectedApp+6] && selectedApp+6 <= apps.length - 1) {
					scrollTo(0, apps[selectedApp+6].offsetTop-apps[selectedApp+6].offsetHeight*2)
				} else scrollTo(0, apps[selectedApp].offsetTop+apps[selectedApp].offsetHeight*2)
			} else apps[selectedApp].classList.add('selected');
		}
		if (gamepad.buttons[0].pressed) {
			apps[selectedApp].querySelector('a').click();
		}

		//dpad
		if (gamepad.buttons[14].pressed) {
			if (selectedApp > 0 && selectedApp % 6 !==0) {
				apps[selectedApp].classList.remove('selected');
				selectedApp--;
				apps[selectedApp].classList.add('selected');
			} else apps[selectedApp].classList.add('selected');
		}
		if (gamepad.buttons[15].pressed) {
			if (selectedApp < apps.length - 1 && selectedApp % 6 !==5) {
				apps[selectedApp].classList.remove('selected');
				selectedApp++;
				apps[selectedApp].classList.add('selected');
			} else apps[selectedApp].classList.add('selected');
		}
		if (gamepad.buttons[12].pressed) {
			if (selectedApp - 6 >= 0) {
				apps[selectedApp].classList.remove('selected');
				selectedApp -= 6;
				apps[selectedApp].classList.add('selected');
				if (selectedApp-6 <= 0) {
					scrollTo(0, 0)
				} else scrollTo(0, apps[selectedApp-6].offsetTop)
			} else apps[selectedApp].classList.add('selected');
		}
		if (gamepad.buttons[13].pressed) {
			if (selectedApp + 6 <= apps.length - 1) {
				apps[selectedApp].classList.remove('selected');
				selectedApp += 6;
				apps[selectedApp].classList.add('selected');
				if (apps[selectedApp+6] && selectedApp+6 <= apps.length - 1) {
					scrollTo(0, apps[selectedApp+6].offsetTop-apps[selectedApp+6].offsetHeight*2)
				} else scrollTo(0, apps[selectedApp].offsetTop+apps[selectedApp].offsetHeight*2)
			} else apps[selectedApp].classList.add('selected');
		}

		//buttons
		if (gamepad.buttons[0].pressed) {
			apps[selectedApp].querySelector('a').click();
		}
		if (gamepad.buttons[2].pressed) {
			window.location.href = 'settings.html';
		}
		if (gamepad.buttons[3].pressed) {
			window.location.href = 'https://google.com';
		}
	}, 100);
});

//Open the settings page
document.querySelector('#SettingsButton').addEventListener('click', () => {
	window.location.href = 'settings.html';
});

document.querySelector('#GoogleSearchButton').addEventListener('click', () => {
	window.location.href = 'https://google.com';
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'x') {
		window.location.href = 'settings.html';
	}
	if (event.key === 'y') {
		window.location.href = 'https://google.com';
	}
	if (event.keyCode === 32) {
		event.preventDefault();
		apps[selectedApp].querySelector('a').click();
	}
});