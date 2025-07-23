package com.example.intent.domain;

import static com.example.intent.domain.RDCheckoutTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.example.intent.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RDCheckoutTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(RDCheckout.class);
        RDCheckout rDCheckout1 = getRDCheckoutSample1();
        RDCheckout rDCheckout2 = new RDCheckout();
        assertThat(rDCheckout1).isNotEqualTo(rDCheckout2);

        rDCheckout2.setId(rDCheckout1.getId());
        assertThat(rDCheckout1).isEqualTo(rDCheckout2);

        rDCheckout2 = getRDCheckoutSample2();
        assertThat(rDCheckout1).isNotEqualTo(rDCheckout2);
    }
}
