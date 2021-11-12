package com.stripesample.applepay.controller;

import static org.springframework.http.ResponseEntity.ok;
import static org.springframework.http.ResponseEntity.status;

import com.google.gson.Gson;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.CustomerCollection;
import com.stripe.model.PaymentIntent;
import com.stripe.model.SetupIntent;
import com.stripe.net.RequestOptions;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.CustomerListParams;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.PaymentIntentCreateParams.CaptureMethod;
import com.stripe.param.PaymentIntentCreateParams.ConfirmationMethod;
import com.stripe.param.SetupIntentCreateParams;
import com.stripesample.applepay.config.StripeConfig;
import com.stripesample.applepay.model.ConfigResponse;
import com.stripesample.applepay.model.CreateSetupIntentRequest;
import com.stripesample.applepay.model.CreateSetupIntentResponse;
import com.stripesample.applepay.model.MakePaymentRequest;
import com.stripesample.applepay.model.MakePaymentResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1")
public class StripeGatewayController {

    private static Gson gson = new Gson();

    @Autowired
    StripeConfig stripeConfig;

    @GetMapping("/config")
    public ResponseEntity config() {
        return ok(gson.toJson(new ConfigResponse(stripeConfig.getPublishableKey())));
    }

    @PostMapping("/create-setup-intent")
    public ResponseEntity createSetup(@RequestBody String request) {
        CreateSetupIntentRequest postBody = gson.fromJson(request, CreateSetupIntentRequest.class);
        Stripe.apiKey = stripeConfig.getSecretKey();

        try {
            // return most recent customer first
            CustomerListParams customerListParams = CustomerListParams.builder().setEmail(postBody.getEmail()).build();
            CustomerCollection customerCollection = Customer.list(customerListParams);

            Customer customer;
            if(customerCollection.getData().size() != 0) {
                customer = customerCollection.getData().get(0);
            } else {
                CustomerCreateParams customerCreateParams = CustomerCreateParams.builder()
                    .setEmail(postBody.getEmail())
                    .build();
                customer = Customer.create(customerCreateParams);
            }

            SetupIntentCreateParams params = SetupIntentCreateParams.builder()
                .setConfirm(false)
                .setCustomer(customer.getId())
                .build();
            SetupIntent intent = SetupIntent.create(params);
            return ok(gson.toJson(new CreateSetupIntentResponse(intent.getClientSecret())));

        } catch (StripeException e) {
            e.printStackTrace();
            return status(HttpStatus.INTERNAL_SERVER_ERROR).body(gson.toJson(e));
        }
    }

    @PostMapping("/make-payment")
    public ResponseEntity makePayment(@RequestBody String request) {
        MakePaymentRequest postBody = gson.fromJson(request, MakePaymentRequest.class);
        Stripe.apiKey = stripeConfig.getSecretKey();
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount(Long.valueOf(postBody.getAmount()))
            .setCurrency("USD")
            .setPaymentMethod(postBody.getPaymentMethodId())
            .addPaymentMethodType("card")
            .setCustomer(postBody.getCustomerId())
            .setConfirm(true)
            .setConfirmationMethod(ConfirmationMethod.AUTOMATIC)
            .setCaptureMethod(CaptureMethod.AUTOMATIC)
            .setOffSession(true)
            .build();
        try {
            PaymentIntent paymentIntent = PaymentIntent.create(params, new RequestOptions.RequestOptionsBuilder().build());
            String status = paymentIntent.getStatus();
            if(status.equals("succeeded")) {
                return ok(gson.toJson(new MakePaymentResponse(true)));
            } else {
                return ok(gson.toJson(new MakePaymentResponse(false)));
            }
        } catch (StripeException e) {
            return status(HttpStatus.INTERNAL_SERVER_ERROR).body(gson.toJson(e));
        }
    }

}
