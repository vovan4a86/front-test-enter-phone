function getScrollWidth() {
	const div = document.createElement("div");
	let scrollBarWidth;

	div.setAttribute("style", [
		"width: 100px",
		"height: 100px",
		"overflow: scroll",
		"position: absolute",
		"top: -9999px"
	].join(";"));

	document.body.appendChild(div);
	scrollBarWidth = div.offsetWidth - div.clientWidth;
	document.body.removeChild(div);

	return scrollBarWidth;
}

const scrollWidth = (getScrollWidth());

function freezeBody() {
	document.body.style.overflow = "hidden";
	if (!scrollWidth) { return; } else {
		document.body.style.paddingRight = scrollWidth + "px";
	}
}
function unfreezeBody() {
	document.body.style.overflow = "";
	if (!scrollWidth) { return; } else {
		document.body.style.paddingRight = "";
	}
}

export { freezeBody, unfreezeBody }
