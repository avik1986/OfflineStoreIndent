package com.example.intent.domain;

import static com.example.intent.domain.StoreManagerTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.example.intent.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class StoreManagerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(StoreManager.class);
        StoreManager storeManager1 = getStoreManagerSample1();
        StoreManager storeManager2 = new StoreManager();
        assertThat(storeManager1).isNotEqualTo(storeManager2);

        storeManager2.setId(storeManager1.getId());
        assertThat(storeManager1).isEqualTo(storeManager2);

        storeManager2 = getStoreManagerSample2();
        assertThat(storeManager1).isNotEqualTo(storeManager2);
    }
}
