document.addEventListener('DOMContentLoaded', async () => {
  // Load the publishable key from the server. The publishable key
  // is set in your .env file. In practice, most users hard code the
  // publishable key when initializing the Stripe object.
  const {publishableKey} = await fetch(
      '/v1/config',
      {headers: {'Content-Type': 'application/json'}}
      ).then((r) =>
        r.json()
      );

  if (!publishableKey) {
    addMessage(
        'No publishable key returned from the server. Please check `.env` and try again'
    );
    alert('Please set your Stripe publishable API key in the .env file');
  }

  // 1. Initialize Stripe
  const stripe = Stripe(publishableKey, {
    apiVersion: '2020-08-27',
  });

  // 2. Create a payment request object
  var paymentRequest = stripe.paymentRequest({
    country: 'US',
    currency: 'usd',
    total: {
      label: 'Demo total',
      amount: 100,
    },
    requestPayerName: true,
    requestPayerEmail: true,
  });

  // 3. Create a PaymentRequestButton element
  const elements = stripe.elements();
  const prButton = elements.create('paymentRequestButton', {
    paymentRequest: paymentRequest,
  });

  // Check the availability of the Payment Request API,
  // then mount the PaymentRequestButton
  paymentRequest.canMakePayment().then(function (result) {
    if (result) {
      prButton.mount('#payment-request-button');
    } else {
      document.getElementById('payment-request-button').style.display = 'none';
      addMessage('Apple Pay support not found. Check the pre-requisites above and ensure you are testing in a supported browser.');
    }
  });

  paymentRequest.on('paymentmethod', async (e) => {
    // Make a call to the server to create a new
    // payment intent and store its client_secret.
    console.log("payment method id ", e.paymentMethod.id)
    console.log("email ", e.payerEmail)

    const {error: backendError, clientSecret} = await fetch(
        '/v1/create-setup-intent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: e.payerEmail,
          }),
        }
    ).then((r) => r.json());
    
    if (backendError) {
      addMessage(backendError.message);
      e.complete('fail');
      return;
    }
    
    addMessage(`Client secret returned.`);

    // Confirm the setupIntent without handling potential next actions (yet).
    let {error, setupIntent} = await stripe.confirmCardSetup (
        clientSecret,
        {
          payment_method: e.paymentMethod.id,
        },
        {
          handleActions: false,
        }
    );

    if (error) {
      addMessage(error.message);

      // Report to the browser that the payment failed, prompting it to
      // re-show the payment interface, or show an error message and close
      // the payment interface.
      e.complete('fail');
      return;
    }
    // Report to the browser that the confirmation was successful, prompting
    // it to close the browser payment method collection interface.
    e.complete('success');
    
    // Check if the setupIntent requires any actions and if so let Stripe.js
    // handle the flow. If using an API version older than "2019-02-11" instead
    // instead check for: `setupIntent.status === "requires_source_action"`.
    if (setupIntent.status === 'requires_action') {
      // Let Stripe.js handle the rest of the payment flow.
      let {error, setupIntent} = await stripe.confirmCardPayment(
          clientSecret
      );
      if (error) {
        // The payment failed -- ask your customer for a new payment method.
        addMessage(error.message);
        return;
      }
      addMessage(`Setup Intent -  ${setupIntent.status}: ${setupIntent.id}`);
    }

    addMessage(`Setup Intent -  ${setupIntent.status}: ${setupIntent.id}`);
  });
});
