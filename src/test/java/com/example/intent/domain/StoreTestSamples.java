package com.example.intent.domain;

import java.util.UUID;

public class StoreTestSamples {

    public static Store getStoreSample1() {
        return new Store().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).name("name1");
    }

    public static Store getStoreSample2() {
        return new Store().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).name("name2");
    }

    public static Store getStoreRandomSampleGenerator() {
        return new Store().id(UUID.randomUUID()).name(UUID.randomUUID().toString());
    }
}
