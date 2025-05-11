class svgMenu extends HTMLElement {
	constructor() {
		super();
		this.files = null;
	}

	connectedCallback() {
		this.initialize();

		this.addEventListener('click', (event) => {
			event.preventDefault();
			if (event.target.tagName === 'A') {
				if (event.target.getAttribute('href').endsWith('.svg')) {
					const href = event.target.getAttribute('href');
					document.documentElement.style.setProperty('--selected-link', `url(/assets/${href})`);
				}
			}
		});
	}

	async initialize() {
		this.files = await this.fetchFilesJson();
		console.log('Files:', this.files);
		let menu = '';
		if (Array.isArray(this.files)) {
			this.files.forEach((element) => {
				menu += `<a href="${element}">${element}</a>`;
			});
		}
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
