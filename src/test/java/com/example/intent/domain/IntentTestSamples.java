package com.example.intent.domain;

import java.util.UUID;

public class IntentTestSamples {

    public static Intent getIntentSample1() {
        return new Intent().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).createdBy("createdBy1").updatedBy("updatedBy1");
    }

    public static Intent getIntentSample2() {
        return new Intent().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).createdBy("createdBy2").updatedBy("updatedBy2");
    }

    public static Intent getIntentRandomSampleGenerator() {
        return new Intent().id(UUID.randomUUID()).createdBy(UUID.randomUUID().toString()).updatedBy(UUID.randomUUID().toString());
    }
}
