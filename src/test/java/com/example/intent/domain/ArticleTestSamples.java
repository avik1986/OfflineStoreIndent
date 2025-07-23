package com.example.intent.domain;

import java.util.UUID;

public class ArticleTestSamples {

    public static Article getArticleSample1() {
        return new Article().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa"));
    }

    public static Article getArticleSample2() {
        return new Article().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367"));
    }

    public static Article getArticleRandomSampleGenerator() {
        return new Article().id(UUID.randomUUID());
    }
}
