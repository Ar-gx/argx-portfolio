class ContactBeaconArt extends HTMLElement {
  connectedCallback() {
    if (!this.firstChild) {
      this.innerHTML = '<div class="beacon-picture"><span class="beacon-glow"></span></div>';
    }
    if (!('IntersectionObserver' in window)) return;
    this.setAttribute('data-waiting', '');
    this.observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      this.removeAttribute('data-waiting');
      this.observer.disconnect();
    }, { threshold: 0.4 });
    this.observer.observe(this);
  }

  disconnectedCallback() {
    this.observer?.disconnect();
  }
}

customElements.define('contact-beacon-art', ContactBeaconArt);
