(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          // Form error (we'll stop the submit outside because we want to block it also on success)
          form.classList.add("was-validated");
        } else {
          const confirmation = document.getElementById("confirmation");
          const wrapper = document.createElement("div");
          wrapper.innerHTML = [
            `<div class="alert alert-success alert-dismissible" role="alert">`,
            `   <div>We have registered your request and we will soon contact you with some options.</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            "</div>",
          ].join("");

          confirmation.append(wrapper);

          // Simulate form submit with a reset
          form.reset();
        }

        // We don't want to send the form to the server, even if it's sucess
        event.preventDefault();
        event.stopPropagation();
      },
      false
    );
  });
})();
