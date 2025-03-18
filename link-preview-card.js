/**
 * Copyright 2025 TravisMa07
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `link-preview-card`
 * 
 * @demo index.html
 * @element link-preview-card
 */
export class LinkPreviewCard extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "link-preview-card";
  }

  constructor() {
    super();
    this.title = "";
    this.desc = "";
    this.image = "";
    this.link = "";
    this.themeColor = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/link-preview-card.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      desc: {type: String},
      image: {type: String},
      link: {type: String},
      themeColor: {type: String},
    };
  }
  

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--link-preview-card-text-color,--ddd-theme-primary);
        background-color: var(--link-preview-card-background-color,--ddd-theme-accent);
        font-family: var(--link-preview-card-font-family,--ddd-font-navigation);
      }
      .wrapper {
        margin: var(--link-preview-card-margin,--ddd-spacing-2);
        padding: var(--link-preview-card-padding,--ddd-spacing-4);
      }
      h3 span {
        font-size: var(--link-preview-card-label-font-size, var(--ddd-font-size-s));
      }
      .loader {
        border: 16px solid var(--link-preview-card-loader-border-color,#f3f3f3); 
        border-top: 16px solid var(--link-preview-card-loader-border-top-color,#3498db);
        border-radius: 50%;
        width: var(--link-preview-card-loader-size,120px);
        height: var(--link-preview-card-loader-size,120px);
        animation: spin 2s linear infinite;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .preview-card {
        display: flex;
        flex-direction: column;
        align-items: normal;
        justify-content: center;
        background-color: var(--link-preview-card-preview-background-color,var(--ddd-theme-accent));
        padding: var(--link-preview-card-preview-padding,var(--ddd-spacing-2));
        border-radius: var(--link-preview-card-border-radius, var(--ddd-border-radius));
        box-shadow: var(--link-preview-card-box-shaddow,var(--ddd-box-shadow));
       
      }
      img{
        width: 90%;
        height: 90%;
      }

    
      
    `];
  }

  // Lit render the HTML
  render() {
    return html`
    <div class="wrapper" part="wrapper">
      <div class="preview-card" part="preview-card">
        ${this.loading ? html`<div class="loader" part="loader"></div>` : html `
        <h2 part="title">${this.title}</h2>
        <p part="desc">${this.desc}</p>
        <a href="${this.link}" part="link">${this.link}</a>
        ${this.image ? html`<img src="${this.image}" alt="${this.title}" part="image"/>` : ''}
        `}
      </div>
    </div>
    `;
  }


  inputChanged(e) {
    this.value = this.shadowRoot.querySelector('#input').value;
  }
  // life cycle will run when anything defined in `properties` is modified
  updated(changedProperties) {
    // see if value changes from user input and is not empty
    if (changedProperties.has('link') && this.link) {
      this.updateResults(this.link);
    }
    else if (changedProperties.has('link') && !this.link) {
      this.items = [];
    }
    // @debugging purposes only
    if (changedProperties.has('items') && this.items.length > 0) {
      console.log(this.items);
    }
  }

  updateResults(value) {
    this.loading = true;
    fetch(`https://images-api.nasa.gov/search?media_type=image&q=${value}`).then(d => d.ok ? d.json(): {}).then(data => {
      if (data.collection) {
        this.items = [];
        this.items = data.collection.items;
        this.loading = false;
      }  
    });
  }
  
  async getData(link) {
    const url = `https://open-apis.hax.cloud/api/services/website/metadata?q=${link}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json.data);
      
      if (json.data) {
        this.title = json.data["og:title"];
        this.desc = json.data["og:description"];
        this.image = json.data["og:image"];
        this.themeColor = json.data["theme-color"];
        this.link = link;
      }else{
        this.title = "No Title Avilable";
        this.desc = "No Description Avilable";
        this.image = "No Image Avilable";
        this.themeColor = "";
      }

    } catch (error) {
      console.error(error.message);
    }
  }
  

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(LinkPreviewCard.tag, LinkPreviewCard);