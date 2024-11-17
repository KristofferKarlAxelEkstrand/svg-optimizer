class svgMenu extends HTMLElement {
	constructor() {
		super();
		this.files = null;
		this.activeSvgUrl = null;
		this.updateInterval = 6000;
	}

	connectedCallback() {
		this.initialize();

		this.activeSvgUrl = localStorage.getItem('activeSvgUrl');
		if (this.activeSvgUrl) {
			this.setActiveSvgUrl(this.activeSvgUrl);
		}

		this.addEventListener('click', (event) => {
			event.preventDefault();
			if (event.target.tagName === 'A') {
				if (event.target.getAttribute('href').endsWith('.svg')) {
					const href = event.target.getAttribute('href');
					this.setActiveSvgUrl(href);
				}
			}
		});

		setInterval(() => {
			this.setActiveSvgUrl(this.activeSvgUrl);
		}, this.updateInterval);
	}

	setActiveSvgUrl(url) {
		const randomNumber = Math.floor(Math.random() * 100000);
		document.documentElement.style.setProperty(
			'--active-svg-url',
			`url(/assets/${url}?${randomNumber})`
		);
		localStorage.setItem('activeSvgUrl', url);
		this.activeSvgUrl = url;
	}
	async initialize() {
		this.files = await this.fetchFilesJson();
		console.log('Files:', this.files);
		let grouped = {};
		if (Array.isArray(this.files)) {
			this.files.forEach((element) => {
				const urlPath = element.replace(/\\/g, '/');
				const parts = urlPath.split('/');
				const folder = parts.length > 1 ? parts[0] : '';
				if (!grouped[folder]) grouped[folder] = [];
				grouped[folder].push(urlPath);
			});
		}
		let menu = '<ul>';
		Object.keys(grouped).forEach((folder) => {
			if (folder) {
				menu += `<li><span>${folder}</span><ul>`;
			}
			grouped[folder].forEach((urlPath) => {
				menu += `<li><a href="${urlPath}">${urlPath}</a></li>`;
			});
			if (folder) {
				menu += `</ul></li>`;
			}
		});
		menu += `</ul>`;
		this.innerHTML = `${menu}`;
	}

	async fetchFilesJson() {
		let data;
		try {
			const response = await fetch('/assets/files.json');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			data = await response.json();
			console.log('Fetched data:', data);
		} catch (error) {
			console.error('Error fetching assets/files.json:', error);
		}
		return data;
	}
}

customElements.define('svg-menu', svgMenu);
