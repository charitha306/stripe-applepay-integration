package com.stripesample.applepay.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@ConfigurationProperties(prefix = "stripe")
@Component
public class StripeConfig {
  private String publishableKey;
  private String secretKey;

  public String getPublishableKey() {
    return this.publishableKey;
  }

  public String getSecretKey() {
    return this.secretKey;
  }

  public void setPublishableKey(String publishableKey) {
    this.publishableKey = publishableKey;
  }

  public void setSecretKey(String secretKey) {
    this.secretKey = secretKey;
  }
}
