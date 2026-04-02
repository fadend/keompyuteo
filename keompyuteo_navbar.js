const LINKS = [
  ["index.html", "Listen"],
  ["custom_phrase.html", "Speak (custom phrase)"],
  ["korean_numbers.html", "Korean numbers"],
  ["malhaneun_sigye.html", "Talking clock"],
];

export default class KeompyuteoNavBar extends HTMLElement {
  connectedCallback() {
    const parts = [];
    for (let [link, text] of LINKS) {
      parts.push(`<a href="${link}">${text}</a>`);
    }
    this.innerHTML = `<nav>${parts.join(" ")}</nav>`;
  }
}

if (!customElements.get("keompyuteo-nav-bar")) {
  customElements.define("keompyuteo-nav-bar", KeompyuteoNavBar);
}
