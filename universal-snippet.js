const template = document.createElement('template');
let parsedContent = "";
template.innerHTML = "";

class UniversalSnippet extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ 'mode': 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));        
  }

  connectedCallback() {
    if(this.hasAttribute('src') && this.hasAttribute('query')) {
      const src = this.getAttribute('src');
      const query = this.getAttribute('query');
      this.scrape(src, query);
    } else {
      console.log('not all attributes are set');
    }
  }

	scrape(src, query) {
		const request = new XMLHttpRequest();
		request.open("GET", src);
		request.responseType = "document";
		request.onload = event => {
			if (request.readyState === 4) {
				if (request.status === 200) {
					const content = request.responseXML;                
					parsedContent = content.querySelector(query);        
					this.shadowRoot.append(parsedContent);
				} else {
					console.error(request.status, request.statusText);
				}
			}
		};
		request.onerror = event => {
			console.error(request.status, request.statusText);
		};
		request.send();
	}
}

window.customElements.define('universal-snippet', UniversalSnippet);