package com.example.intent.domain;

import static com.example.intent.domain.ArticleTestSamples.*;
import static com.example.intent.domain.CouponTestSamples.*;
import static com.example.intent.domain.IntentTestSamples.*;
import static com.example.intent.domain.RDCheckoutTestSamples.*;
import static com.example.intent.domain.StoreManagerTestSamples.*;
import static com.example.intent.domain.StoreTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.example.intent.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class IntentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Intent.class);
        Intent intent1 = getIntentSample1();
        Intent intent2 = new Intent();
        assertThat(intent1).isNotEqualTo(intent2);

        intent2.setId(intent1.getId());
        assertThat(intent1).isEqualTo(intent2);

        intent2 = getIntentSample2();
        assertThat(intent1).isNotEqualTo(intent2);
    }

    @Test
    void articleTest() {
        Intent intent = getIntentRandomSampleGenerator();
        Article articleBack = getArticleRandomSampleGenerator();

        intent.setArticle(articleBack);
        assertThat(intent.getArticle()).isEqualTo(articleBack);

        intent.article(null);
        assertThat(intent.getArticle()).isNull();
    }

    @Test
    void storeManagerTest() {
        Intent intent = getIntentRandomSampleGenerator();
        StoreManager storeManagerBack = getStoreManagerRandomSampleGenerator();

        intent.setStoreManager(storeManagerBack);
        assertThat(intent.getStoreManager()).isEqualTo(storeManagerBack);

        intent.storeManager(null);
        assertThat(intent.getStoreManager()).isNull();
    }

    @Test
    void storeTest() {
        Intent intent = getIntentRandomSampleGenerator();
        Store storeBack = getStoreRandomSampleGenerator();

        intent.setStore(storeBack);
        assertThat(intent.getStore()).isEqualTo(storeBack);

        intent.store(null);
        assertThat(intent.getStore()).isNull();
    }

    @Test
    void couponTest() {
        Intent intent = getIntentRandomSampleGenerator();
        Coupon couponBack = getCouponRandomSampleGenerator();

        intent.setCoupon(couponBack);
        assertThat(intent.getCoupon()).isEqualTo(couponBack);

        intent.coupon(null);
        assertThat(intent.getCoupon()).isNull();
    }

    @Test
    void rdCheckoutTest() {
        Intent intent = getIntentRandomSampleGenerator();
        RDCheckout rDCheckoutBack = getRDCheckoutRandomSampleGenerator();

        intent.setRdCheckout(rDCheckoutBack);
        assertThat(intent.getRdCheckout()).isEqualTo(rDCheckoutBack);

        intent.rdCheckout(null);
        assertThat(intent.getRdCheckout()).isNull();
    }
}
