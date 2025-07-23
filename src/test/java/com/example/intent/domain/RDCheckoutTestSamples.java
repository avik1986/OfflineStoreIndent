package com.example.intent.domain;

import java.util.UUID;

public class RDCheckoutTestSamples {

    public static RDCheckout getRDCheckoutSample1() {
        return new RDCheckout()
            .id("id1")
            .status("status1")
            .paymentStatus("paymentStatus1")
            .orderId("orderId1")
            .orderDeliveryStatus("orderDeliveryStatus1");
    }

    public static RDCheckout getRDCheckoutSample2() {
        return new RDCheckout()
            .id("id2")
            .status("status2")
            .paymentStatus("paymentStatus2")
            .orderId("orderId2")
            .orderDeliveryStatus("orderDeliveryStatus2");
    }

    public static RDCheckout getRDCheckoutRandomSampleGenerator() {
        return new RDCheckout()
            .id(UUID.randomUUID().toString())
            .status(UUID.randomUUID().toString())
            .paymentStatus(UUID.randomUUID().toString())
            .orderId(UUID.randomUUID().toString())
            .orderDeliveryStatus(UUID.randomUUID().toString());
    }
}
