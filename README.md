### Stripe Apple Pay Integration

This project demonstrates how to set up Apple Pay payment methods for future payments using Stripe Payment Gateway. 

### Setup Instructions

Modify `src/main/resources/config/application.properties` to include Stripe publishable key and secret key.

Run:

~~~
mvn clean install -DskipTests
~~~

to install maven packages, and run:

~~~
mvn spring-boot:run
~~~

to run the app.

Application will be run in port 8080.


### API 

#### /v1/config

Returns the Stripe publishable key

#### /v1/create-setup-intent

Creates Stripe customer(if not already exist for the given email address) and creates SetupIntent.

#### /v1/make-payment

Creates PaymentIntent with given payment method id, customer id and amount. The capture happens automatically. 

~~~
curl -X POST http://localhost:8080/v1/make-payment -H 'Content-Type: application/json' -d '{"paymentMethodId":"<Stripe_payment_method_id>", "customerId":"<Stripe_custoer_id>", "amount":"100"}'
~~~
