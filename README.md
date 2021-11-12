### Stripe Apple Pay Integration

This project demonstrates how to set up Apple Pay payment methods for future payments using Stripe Payment Gateway. 

### API 

#### /v1/config

Returns the Stripe publishable key

#### /v1/create-setup-intent

Creates Stripe customer(if not already exist for the given email address) and creates SetupIntent.

#### /v1/make-payment

Creates PaymentIntent with given payment method id, customer id and amount. The capture happens automatically. 
