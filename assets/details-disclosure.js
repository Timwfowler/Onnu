class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    this.content = this.mainDetailsToggle.querySelector('summary').nextElementSibling;

    this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
    this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));

    // this.mainDetailsToggle.addEventListener('mouseenter', this.onToggleHover.bind(this), 'text');



  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
      console.log('focus out');
    })
  }

  onToggle() {


    if (!this.animations) this.animations = this.content.getAnimations();

    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.animations.forEach(animation => animation.play());
    } else {
      this.animations.forEach(animation => animation.cancel());
    }
  }

  close() {
    this.mainDetailsToggle.removeAttribute('open');
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', false);

  }
}

customElements.define('details-disclosure', DetailsDisclosure);

class HeaderMenu extends DetailsDisclosure {
  constructor() {
    super();
    this.header = document.querySelector('.header-wrapper');
  }

  onToggleHover(event) {
    if (!this.header) return;

    const megaMenu = this.querySelector('.mega-menu__content')

    this.mainDetailsToggle.open = true;
    megaMenu.style.backgroundColor = "transparent"
    megaMenu.style.opacity = "0"
    megaMenu.style.transition = "0s"
    console.log('open');



  }

  onToggle(event) {


    if (!this.header) return;
    this.header.preventHide = this.mainDetailsToggle.open;
    const megaMenu = this.querySelector('.mega-menu__content')

    

    if (this.mainDetailsToggle.open) {
      megaMenu.style.backgroundColor = "transparent"
      megaMenu.style.opacity = "0"
      megaMenu.style.transition = "0s"
      console.log('open');



      setTimeout(function() {
        megaMenu.style.transition = "0s"
        megaMenu.style.backgroundColor = "white"
        megaMenu.style.opacity = "1"
        document.querySelector('header').classList.add('force-white')
      }, 20);

      setTimeout(function() {
        megaMenu.style.transition = "0s"
        megaMenu.style.backgroundColor = "white"
        megaMenu.style.opacity = "1"
        document.querySelector('header').classList.add('force-white')
      }, 20);




    }else{
      console.log('close');
      megaMenu.style.opacity = "0"
      megaMenu.style.backgroundColor = "transparent"
      megaMenu.style.transition = "0s"
      document.querySelector('header').classList.remove('force-white')
    }   
    


    if (document.documentElement.style.getPropertyValue('--header-bottom-position-desktop') !== '') return;
    document.documentElement.style.setProperty('--header-bottom-position-desktop', `${Math.floor(this.header.getBoundingClientRect().bottom)}px`);
  }
}

customElements.define('header-menu', HeaderMenu);


// let items = document.querySelector(".header__inline-menu").querySelectorAll("details");
// console.log(items)
// items.forEach(item => {
//   console.log(item)
//   item.addEventListener("mouseover", () => {
//     item.setAttribute("open", true);
//     item.querySelector("ul").addEventListener("mouseleave", () => {
//       item.removeAttribute("open");
//       console.log('ouyt');
//     });
//   item.addEventListener("mouseleave", (e) => {

//     console.log(e.target);
//     item.removeAttribute("open");
//     console.log('outtttt');
//   });
// });

// });
