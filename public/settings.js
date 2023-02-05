

//Open the home page
document.querySelector('#HomeButton').addEventListener('click', () => {
	window.location.href = 'home.html';
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'x') {
		window.location.href = 'home.html';
	}
	if (event.key === 'y') {
		window.location.href = 'https://google.com';
	}
});