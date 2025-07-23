package com.example.intent.domain;

import java.util.UUID;

public class StoreManagerTestSamples {

    public static StoreManager getStoreManagerSample1() {
        return new StoreManager().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).name("name1");
    }

    public static StoreManager getStoreManagerSample2() {
        return new StoreManager().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).name("name2");
    }

    public static StoreManager getStoreManagerRandomSampleGenerator() {
        return new StoreManager().id(UUID.randomUUID()).name(UUID.randomUUID().toString());
    }
}
