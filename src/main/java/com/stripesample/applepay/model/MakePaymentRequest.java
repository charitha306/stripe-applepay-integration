package com.stripesample.applepay.model;

import com.google.gson.annotations.SerializedName;

public class MakePaymentRequest {
  @SerializedName("paymentMethodId")
  String paymentMethodId;

  @SerializedName("customerId")
  String customerId;

  @SerializedName("amount")
  String amount;

  public String getPaymentMethodId() {
    return paymentMethodId;
  }

  public String getCustomerId() {
    return customerId;
  }

  public String getAmount() {
    return amount;
  }
}
