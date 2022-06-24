window.addEventListener("DOMContentLoaded", function() {
	[].forEach.call( document.querySelectorAll('.tel'), function(input) {
		let keyCode;
		function mask(event) {
			event.keyCode && (keyCode = event.keyCode);
			let pos = this.selectionStart;
			if (pos < 3) event.preventDefault();
			let matrix = "+7 (___) ___ ____",
					i = 0,
					def = matrix.replace(/\D/g, ""),
					val = this.value.replace(/\D/g, ""),
					new_value = matrix.replace(/[_\d]/g, function(a) {
						return i < val.length ? val.charAt(i++) || def.charAt(i) : a
					});
			i = new_value.indexOf("_");
			if (i != -1) {
				i < 5 && (i = 3);
				new_value = new_value.slice(0, i)
			}
			let reg = matrix.substr(0, this.value.length).replace(/_+/g,
					function(a) {
						return "\\d{1," + a.length + "}"
					}).replace(/[+()]/g, "\\$&");
			reg = new RegExp("^" + reg + "$");
			if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
			if (event.type == "blur" && this.value.length < 5)  this.value = ""
		}

		input.addEventListener("input", mask, false);
		input.addEventListener("focus", mask, false);
		input.addEventListener("blur", mask, false);
		input.addEventListener("keydown", mask, false)
	});

	const enterCode = document.querySelector('.enter-code');
	const auth = document.querySelector('.auth');
	const phoneNumber = document.getElementById('phone-number')
	const error = document.querySelector('.error')
	const send = document.querySelector('.send');
	const phoneBorderField = document.querySelector('.phone')

	phoneNumber.addEventListener('click', () => {
		phoneBorderField.classList.remove('border-error');
		error.innerHTML = "";
	})

	send.addEventListener('click', e => {
		e.preventDefault()
		e.stopPropagation()

		if(phoneNumber.value.length === 0) {
			error.innerHTML = "Введите номер телефона";
			phoneBorderField.classList.add('border-error');
		} else if (!phoneNumber.value.match(/^(\+7) \(\d{3}\) \d{3} \d{4}$/)) {
			phoneBorderField.classList.add('border-error');
			error.innerHTML = "Неправильный номер";
		} else {
			auth.classList.add('hide');
			enterCode.classList.add('show');
		}
	})

	const reg = document.querySelector('.reg');
	const codeField = document.getElementById('code')
	const codeError = document.querySelector('.code-error')
	const codeBorderField = document.querySelector('.code-field')

	codeField.addEventListener('click', () => {
		codeError.innerHTML = ''
		codeBorderField.classList.remove('border-error');
	})

	reg.addEventListener('click', e => {
		e.preventDefault();
		if(codeField.value.length === 0) {
			codeError.innerHTML = "Введите код из СМС";
			codeBorderField.classList.add('border-error');
		} else if(codeField.value.length !== 4) {
			codeError.innerHTML = "Введите 4-значный код из СМС";
			codeBorderField.classList.add('border-error');
		} else {
			window.location.href = '/';
		}
	})
});
