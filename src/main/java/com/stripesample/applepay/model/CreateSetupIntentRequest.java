package com.stripesample.applepay.model;

import com.google.gson.annotations.SerializedName;

public class CreateSetupIntentRequest {
  @SerializedName("paymentMethodId")
  String paymentMethodId;

  @SerializedName("email")
  String email;

  public String getPaymentMethodId() {
    return paymentMethodId;
  }

  public String getEmail() {
    return email;
  }
}
