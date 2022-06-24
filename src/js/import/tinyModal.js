/*
 *  Tiny Modal - v0.1.0
 *  Clean, Fast, Modular and customizable Modal Window controller.
 *  https://github.com/juanbrujo/tinyModal
 *  Demo: http://juanbrujo.github.io/tinyModal/
 */
const tinyModal = (function(){

	if (!document.querySelector || !("className" in document.body)) {
		return false;
	}

	let container = document.body,
			popup = document.querySelector(".tinymodal-window-open"),
			status = null;

	container.className = container.className.replace(/\s+$/gi, "") + " tinymodal-ready";

	// utils
	function addClass(element, name) {
		element.className = element.className.replace(/\s+$/gi,"") + " " + name;
	}
	function removeClass(element, name) {
		if( element ) {
			element.className = element.className.replace(name, "");
		}
	}

	// add cover
	function addCover(){
		let newCover = document.createElement("div");
		addClass(newCover,"tinymodal-cover");
		document.body.appendChild(newCover);
	}
	// remove cover
	function removeCover(){
		let actualCover = document.querySelector(".tinymodal-cover");
		if( actualCover ) {
			actualCover.parentNode.removeChild(actualCover);
		}
	}
	// deactivate on ESC key
	function onEscKey(event) {
		if(event.keyCode === 27) {
			deactivate();
		}
	}
	// deactivate on cover click
	function onCoverClick(event) {
		if(event.target === "cover" || event.target === close) {
			deactivate();
		}
	}

	// get and set modal size by data-size
	function getSize(element){
		let size = element.getAttribute("data-size");
		if(size) {
			let sizes = size.split(",");
			console.log(sizes);
			element.setAttribute("style", "width:" + sizes[0] + ";height:" + sizes[1] + ";");
		}
	}

	// get and set modal class if available, by data-classname
	function getNewClass(element){
		let newClass = element.getAttribute("data-newclass");
		if(newClass) {
			addClass(element, newClass);
		}
	}

	// activate function
	function activate(state) {
		addCover();
		let cover = document.querySelector(".tinymodal-cover"),
				close = document.querySelectorAll(".tinymodal-close");
		if(close.length) {
			for (let i = 0; i < close.length; i++) {
				close[i].addEventListener("click", deactivate, false);
			}
		}
		document.addEventListener("keyup", onEscKey, false);
		cover.addEventListener("click", deactivate, false);
		cover.addEventListener("touchstart", deactivate, false);
		removeClass(popup,status);
		addClass(popup,state);
		getSize(popup);
		getNewClass(popup);
		setTimeout(function(){
			addClass(container, "tinymodal-active");
		}, 0);
		status = state;
	}

	// deactivate function
	function deactivate() {
		document.removeEventListener("keyup", onEscKey, false);
		document.removeEventListener("click", onCoverClick, false);
		document.removeEventListener("touchstart", onCoverClick, false);
		removeCover();
		removeClass(container, "tinymodal-active");
		removeClass(popup, "tinymodal-window-open");
		if(popup) {
			if(popup.classList.contains("tinymodal-new")) {
				setTimeout(function(){
					popup.parentNode.removeChild(popup);
				}, 300);
			}
		}
		// unfreezeModal();  // use lib FreezeModal!!!!!!!!!!!!
		// if (!window.matchMedia("(max-width: 992px)").matches) {
		//     unfreezeModal()
		// }
	}

	// openModal public method, w/ onOpen callback
	function openModal(selector, onOpen){
		if (selector.indexOf("#") > -1) {
			popup = document.querySelector(selector);
		} else if (selector.match(/[.jpg|.JPG|.png|.PNG|.gif|.GIF|.webp|.WEBP]/)) {
			popup = document.createElement("aside");
			popup.setAttribute("class","tinymodal-window tinymodal-new");
			popup.innerHTML = "<div class=\"tinymodal-inner\"><img src=\"" + selector + "\"/></div>";
			document.body.appendChild(popup);
		}
		addClass(popup, "tinymodal-window-open");
		activate("");
		if(onOpen && typeof(onOpen) === "function"){
			onOpen.call(popup);
		}
		// freezeModal(); // use lib FreezeModal!!!!!!!!!!!!

		//freeze body only 992px and higher
		// if (!window.matchMedia("(max-width: 992px)").matches) {
		//     freezeModal() // unfreeze -> deactivate (потому что закрываем собственной кнопкой и closeModal не работает)
		// }
		return this;
	}

	// closeModal public method, w/ onClose callback
	function closeModal(onClose) {
		deactivate();
		if(onClose && typeof(onClose) === "function"){
			onClose.call(popup);
		}
	}

	return {
		openModal: openModal,
		closeModal: closeModal
	};

})();
