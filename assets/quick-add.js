if (!customElements.get('quick-add-modal')) {
  customElements.define('quick-add-modal', class QuickAddModal extends ModalDialog {
    constructor() {
      super();
      this.modalContent = this.querySelector('[id^="QuickAddInfo-"]');
    }

    hide(preventFocus = false) {
      const cartNotification = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
      if (cartNotification) cartNotification.setActiveElement(this.openedBy);
      this.modalContent.innerHTML = '';

      if (preventFocus) this.openedBy = null;
      super.hide();
    }

    show(opener) {
      console.log('showing');
      let reduced = false

   



      if (opener.getAttribute('data-reduced-conetent')) {
        const dummyButton = opener.parentNode.querySelector('.js-add-to-bag-with-vars');
        opener.removeAttribute('data-reduced-conetent');  
        reduced = true;
        dummyButton.querySelector('.loading-overlay__spinner').classList.remove('hidden');
        dummyButton.classList.add('loading');
        dummyButton.setAttribute('aria-disabled', true);
        this.classList.add('reduced-content');
      }else{
        opener.querySelector('.loading-overlay__spinner').classList.remove('hidden');
        opener.classList.add('loading');
        opener.setAttribute('aria-disabled', true);
        this.classList.remove('reduced-content');
      }



      console.log('opening');

      fetch(opener.getAttribute('data-product-url'))
        .then((response) => response.text())
        .then((responseText) => {
          const responseHTML = new DOMParser().parseFromString(responseText, 'text/html');
          this.productElement = responseHTML.querySelector('section[id^="MainProduct-"]');
          this.preventDuplicatedIDs();
          this.removeDOMElements();
          this.setInnerHTML(this.modalContent, this.productElement.innerHTML);

          if (window.Shopify && Shopify.PaymentButton) {
            Shopify.PaymentButton.init();
          }

          if (window.ProductModel) window.ProductModel.loadShopifyXR();

          this.removeGalleryListSemantic();
          this.updateImageSizes();
          this.preventVariantURLSwitching();
          super.show(opener);
        })
        .finally(() => {
          opener.removeAttribute('aria-disabled');
          opener.classList.remove('loading');
          opener.querySelector('.loading-overlay__spinner').classList.add('hidden');

          if (reduced) {
            const dummyButton = opener.parentNode.querySelector('.js-add-to-bag-with-vars');
  

            dummyButton.removeAttribute('aria-disabled');
            dummyButton.classList.remove('loading');
            dummyButton.querySelector('.loading-overlay__spinner').classList.add('hidden');
          }else{
            opener.removeAttribute('aria-disabled');
            opener.classList.remove('loading');
            opener.querySelector('.loading-overlay__spinner').classList.add('hidden');
          }
        });
    }

    setInnerHTML(element, html) {
      element.innerHTML = html;

      // Reinjects the script tags to allow execution. By default, scripts are disabled when using element.innerHTML.
      element.querySelectorAll('script').forEach(oldScriptTag => {
        const newScriptTag = document.createElement('script');
        Array.from(oldScriptTag.attributes).forEach(attribute => {
          newScriptTag.setAttribute(attribute.name, attribute.value)
        });
        newScriptTag.appendChild(document.createTextNode(oldScriptTag.innerHTML));
        oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
      });
    }

    preventVariantURLSwitching() {
      const variantPicker = this.modalContent.querySelector('variant-radios,variant-selects');
      if (!variantPicker) return;

      variantPicker.setAttribute('data-update-url', 'false');
    }

    removeDOMElements() {
      const pickupAvailability = this.productElement.querySelector('pickup-availability');
      if (pickupAvailability) pickupAvailability.remove();

      const productModal = this.productElement.querySelector('product-modal');
      if (productModal) productModal.remove();

      const modalDialog = this.productElement.querySelectorAll('modal-dialog');
      if (modalDialog) modalDialog.forEach(modal => modal.remove());
    }

    preventDuplicatedIDs() {



      const sectionId = this.productElement.dataset.section;
      this.productElement.innerHTML = this.productElement.innerHTML.replaceAll(sectionId, `quickadd-${ sectionId }`);
      this.productElement.querySelectorAll('variant-selects, variant-radios, product-info').forEach((element) => {
        element.dataset.originalSection = sectionId;
      });
    }

    removeGalleryListSemantic() {
      const galleryList = this.modalContent.querySelector('[id^="Slider-Gallery"]');
      if (!galleryList) return;

      galleryList.setAttribute('role', 'presentation');
      galleryList.querySelectorAll('[id^="Slide-"]').forEach(li => li.setAttribute('role', 'presentation'));
    }

    updateImageSizes() {
      const product = this.modalContent.querySelector('.product');
      const desktopColumns = product.classList.contains('product--columns');
      if (!desktopColumns) return;

      const mediaImages = product.querySelectorAll('.product__media img');
      if (!mediaImages.length) return;

      let mediaImageSizes = '(min-width: 1000px) 715px, (min-width: 750px) calc((100vw - 11.5rem) / 2), calc(100vw - 4rem)';
      
      if (product.classList.contains('product--medium')) {
        mediaImageSizes = mediaImageSizes.replace('715px', '605px');
      } else if (product.classList.contains('product--small')) {
        mediaImageSizes = mediaImageSizes.replace('715px', '495px');
      }

      mediaImages.forEach(img => img.setAttribute('sizes', mediaImageSizes));
    }
  });
}



// when dom content is loaded
document.addEventListener('DOMContentLoaded', () => {
  const addToBagWithVars = document.querySelectorAll('.js-add-to-bag-with-vars');

  addToBagWithVars.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      console.log('clicked');
      const realButton = button.parentNode.querySelector('.quick-add__submit');
      realButton.setAttribute('data-reduced-conetent', true);

      realButton.click();


    })
  })


})
