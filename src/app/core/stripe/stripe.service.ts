import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';

@Injectable()
export class StripeService {

  private API_URL = 'api/v3/payments';
  private API_URL_PROTOOL = 'api/v3/protool';

  constructor(private http: HttpService) {
  }

  private enableInputs(form) {
    Array.prototype.forEach.call(
      form.querySelectorAll(
        "input[type='text'], input[type='email'], input[type='tel']"
      ),
      function(input) {
        input.removeAttribute('disabled');
      }
    );
  }

  private disableInputs(form) {
    Array.prototype.forEach.call(
      form.querySelectorAll(
        "input[type='text'], input[type='email'], input[type='tel']"
      ),
      function(input) {
        input.setAttribute('disabled', 'true');
      }
    );
  }

  private triggerBrowserValidation(form) {
    var submit = document.createElement('input');
    submit.type = 'submit';
    submit.style.display = 'none';
    form.appendChild(submit);
    submit.click();
    submit.remove();
  }


  /*public registerElements(elements: any, exampleName: string) {
    let formClass = '.' + exampleName;
    let example = document.querySelector(formClass);
    let form = example.querySelector('form');
    let resetButton = example.querySelector('a.reset');
    let error = form.querySelector('.error');
    let errorMessage = error.querySelector('.message');

    // Listen for errors from each Element, and show error messages in the UI.
    let savedErrors = {};
    elements.forEach(function(element, idx) {
      element.on('change', function(event) {
        if (event.error) {
          error.classList.add('visible');
          savedErrors[idx] = event.error.message;
          errorMessage.innerText = event.error.message;
        } else {
          savedErrors[idx] = null;

          // Loop over the saved errors and find the first one, if any.
          let nextError = Object.keys(savedErrors)
            .sort()
            .reduce(function(maybeFoundError, key) {
              return maybeFoundError || savedErrors[key];
            }, null);

          if (nextError) {
            // Now that they've fixed the current error, show another one.
            errorMessage.innerText = nextError;
          } else {
            // The user fixed the last error; no more errors.
            error.classList.remove('visible');
          }
        }
      });
    });
    // Listen on the form's 'submit' handler...
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Trigger HTML5 validation UI on the form if any of the inputs fail
      // validation.
      var plainInputsValid = true;
      Array.prototype.forEach.call(form.querySelectorAll('input'), function(
        input
      ) {
        if (input.checkValidity && !input.checkValidity()) {
          plainInputsValid = false;
          return;
        }
      });
      if (!plainInputsValid) {
        this.triggerBrowserValidation(form);
        return;
      }

      // Show a loading screen...
      example.classList.add('submitting');

      // Disable all inputs.
      //this.disableInputs(form);

      // Use Stripe.js to create a token. We only need to pass in one Element
      // from the Element group in order to create a token. We can also pass
      // in the additional customer data we collected in our form.
      console.log('element for token ', elements[0]);
      stripe.createToken(elements[0]).then(function(result) {
        // Stop loading!
        example.classList.remove('submitting');

        if (result.token) {
          // If we received a token, show the token ID.
          example.querySelector('.token').innerText = result.token.id;
          example.classList.add('submitted');
        } else {
          // Otherwise, un-disable inputs.
          this.enableInputs(form);
        }
      });
    });
    resetButton.addEventListener('click', function(e) {
      e.preventDefault();
      // Resetting the form (instead of setting the value to `''` for each input)
      // helps us clear webkit autofill styles.
      form.reset();

      // Clear each Element.
      elements.forEach(function(element) {
        element.clear();
      });

      // Reset error state as well.
      error.classList.remove('visible');

      // Resetting the form does not un-disable inputs, so we need to do it separately:
      this.enableInputs(form);
      example.classList.remove('submitted');
    });
  }*/

}