document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll(".tinymodal-modal");

    for (let i = 0; links.length > i; i++) {
        links[i].addEventListener("click", function(event){  // callback
            event.preventDefault();
            // const element = this.getAttribute("href");
            // tinyModal.openModal(element);
        });
    }

    //переход к форме
    const smoothLink = document.querySelector(".header-order-btn");
    smoothLink.addEventListener("click", function (e) {
        e.preventDefault();
        const id = smoothLink.getAttribute("href");
        document.querySelector(id).scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    //go-top
    const goTopBtn = document.querySelector("#go-top");
    goTopBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo(pageYOffset, 0);
        //css -> html {scroll-behavior: smooth;}

    });

    window.addEventListener("scroll", () => {
        if(window.pageYOffset > 200)  {
            goTopBtn.style.opacity = "1";
        } else {
            goTopBtn.style.opacity = "0";
        }
    });

    //span для ошибок валидации на сервере
    const serverErrText = document.querySelector("#order-server-err");
    const form = document.querySelector("#form");
    form.addEventListener("input", function() {
        this.btnSubmit.disabled = !this.checkValidity();

        Array.from(form.elements).forEach(input => {
            input.addEventListener("click", ()=> {
                serverErrText.innerHTML = "";
            });
            if(input.required && input.type !== "checkbox") {
                input.addEventListener("change", ()=> {
                    if(input.checkValidity()) {
                        input.classList.remove("invalid");
                        input.classList.add("valid");
                    } else {
                        input.classList.remove("valid");
                        input.classList.add("invalid");
                        input.reportValidity();
                    }
                });
            }
        });
    });

    //telephone mask
    [].forEach.call( document.querySelectorAll(".tel"), function(input) {
        let keyCode;
        function mask(event) {
            event.keyCode && (keyCode = event.keyCode);
            let pos = this.selectionStart;
            if (pos < 3) event.preventDefault();
            let matrix = "+7 (___)-___-____",
                i = 0,
                def = matrix.replace(/\D/g, ""),
                val = this.value.replace(/\D/g, ""),
                new_value = matrix.replace(/[_\d]/g, function(a) {
                    return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
                });
            i = new_value.indexOf("_");
            if (i != -1) {
                i < 5 && (i = 3);
                new_value = new_value.slice(0, i);
            }
            let reg = matrix.substr(0, this.value.length).replace(/_+/g,
                function(a) {
                    return "\\d{1," + a.length + "}";
                }).replace(/[+()]/g, "\\$&");
            reg = new RegExp("^" + reg + "$");
            if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
            if (event.type === "blur" && this.value.length < 5)  this.value = "";
        }

        input.addEventListener("input", mask, false);
        input.addEventListener("focus", mask, false);
        input.addEventListener("blur", mask, false);
        input.addEventListener("keydown", mask, false);
    });


    //ОТПРАВКА ФОРМЫ FETCH
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(form);

        fetch("php/send.php", {
            method: "POST",
            body: formData
        })
            // .then(response => {
            //     if(response.status == 200) {
            //         tinyModal.openModal('#modal-submit');
            //         form.reset();
            //         form.btnSubmit.disabled = !this.checkValidity();
            //         Array.from(form.elements).forEach(input => {
            //             input.classList.remove('valid')
            //         })
            //     } else if(response.status == 406) {
            //         const data = response.json();
            //         console.log(data);
            //     }
            // })
            .then(response => response.json())
            .then(data => {
                if(data.accept) {
                    // tinyModal.openModal("#modal-submit");
                    form.reset();
                    form.btnSubmit.disabled = !this.checkValidity();
                    Array.from(form.elements).forEach(input => {
                        input.classList.remove("valid");
                    });
                } else {
                    serverErrText.innerHTML = "Ошибка валидации на сервере. Проверьте введенные данные.";
                    console.error(data.error);
                }
            })

            .catch(error => console.error("my_err: ", error));
    });

});
