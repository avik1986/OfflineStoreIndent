package com.example.intent.domain;

import java.util.UUID;

public class CouponTestSamples {

    public static Coupon getCouponSample1() {
        return new Coupon().id("id1").text("text1");
    }

    public static Coupon getCouponSample2() {
        return new Coupon().id("id2").text("text2");
    }

    public static Coupon getCouponRandomSampleGenerator() {
        return new Coupon().id(UUID.randomUUID().toString()).text(UUID.randomUUID().toString());
    }
}
