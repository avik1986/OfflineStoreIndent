package com.example.intent.web.rest;

import static com.example.intent.domain.CouponAsserts.*;
import static com.example.intent.web.rest.TestUtil.createUpdateProxyForBean;
import static com.example.intent.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.intent.IntegrationTest;
import com.example.intent.domain.Coupon;
import com.example.intent.domain.enumeration.CouponType;
import com.example.intent.repository.CouponRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CouponResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CouponResourceIT {

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final CouponType DEFAULT_TYPE = CouponType.PERCENT;
    private static final CouponType UPDATED_TYPE = CouponType.FIXED;

    private static final BigDecimal DEFAULT_VALUE = new BigDecimal(1);
    private static final BigDecimal UPDATED_VALUE = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/coupons";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCouponMockMvc;

    private Coupon coupon;

    private Coupon insertedCoupon;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Coupon createEntity() {
        return new Coupon().text(DEFAULT_TEXT).type(DEFAULT_TYPE).value(DEFAULT_VALUE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Coupon createUpdatedEntity() {
        return new Coupon().text(UPDATED_TEXT).type(UPDATED_TYPE).value(UPDATED_VALUE);
    }

    @BeforeEach
    void initTest() {
        coupon = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedCoupon != null) {
            couponRepository.delete(insertedCoupon);
            insertedCoupon = null;
        }
    }

    @Test
    @Transactional
    void createCoupon() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Coupon
        var returnedCoupon = om.readValue(
            restCouponMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(coupon)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Coupon.class
        );

        // Validate the Coupon in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertCouponUpdatableFieldsEquals(returnedCoupon, getPersistedCoupon(returnedCoupon));

        insertedCoupon = returnedCoupon;
    }

    @Test
    @Transactional
    void createCouponWithExistingId() throws Exception {
        // Create the Coupon with an existing ID
        coupon.setId("existing_id");

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCouponMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(coupon)))
            .andExpect(status().isBadRequest());

        // Validate the Coupon in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCoupons() throws Exception {
        // Initialize the database
        insertedCoupon = couponRepository.saveAndFlush(coupon);

        // Get all the couponList
        restCouponMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(coupon.getId())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(sameNumber(DEFAULT_VALUE))));
    }

    @Test
    @Transactional
    void getCoupon() throws Exception {
        // Initialize the database
        insertedCoupon = couponRepository.saveAndFlush(coupon);

        // Get the coupon
        restCouponMockMvc
            .perform(get(ENTITY_API_URL_ID, coupon.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(coupon.getId()))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.value").value(sameNumber(DEFAULT_VALUE)));
    }

    @Test
    @Transactional
    void getNonExistingCoupon() throws Exception {
        // Get the coupon
        restCouponMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCoupon() throws Exception {
        // Initialize the database
        insertedCoupon = couponRepository.saveAndFlush(coupon);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the coupon
        Coupon updatedCoupon = couponRepository.findById(coupon.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedCoupon are not directly saved in db
        em.detach(updatedCoupon);
        updatedCoupon.text(UPDATED_TEXT).type(UPDATED_TYPE).value(UPDATED_VALUE);

        restCouponMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCoupon.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedCoupon))
            )
            .andExpect(status().isOk());

        // Validate the Coupon in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedCouponToMatchAllProperties(updatedCoupon);
    }

    @Test
    @Transactional
    void putNonExistingCoupon() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        coupon.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCouponMockMvc
            .perform(put(ENTITY_API_URL_ID, coupon.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(coupon)))
            .andExpect(status().isBadRequest());

        // Validate the Coupon in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCoupon() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        coupon.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCouponMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(coupon))
            )
            .andExpect(status().isBadRequest());

        // Validate the Coupon in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCoupon() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        coupon.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCouponMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(coupon)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Coupon in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCouponWithPatch() throws Exception {
        // Initialize the database
        insertedCoupon = couponRepository.saveAndFlush(coupon);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the coupon using partial update
        Coupon partialUpdatedCoupon = new Coupon();
        partialUpdatedCoupon.setId(coupon.getId());

        partialUpdatedCoupon.type(UPDATED_TYPE);

        restCouponMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCoupon.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCoupon))
            )
            .andExpect(status().isOk());

        // Validate the Coupon in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCouponUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedCoupon, coupon), getPersistedCoupon(coupon));
    }

    @Test
    @Transactional
    void fullUpdateCouponWithPatch() throws Exception {
        // Initialize the database
        insertedCoupon = couponRepository.saveAndFlush(coupon);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the coupon using partial update
        Coupon partialUpdatedCoupon = new Coupon();
        partialUpdatedCoupon.setId(coupon.getId());

        partialUpdatedCoupon.text(UPDATED_TEXT).type(UPDATED_TYPE).value(UPDATED_VALUE);

        restCouponMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCoupon.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedCoupon))
            )
            .andExpect(status().isOk());

        // Validate the Coupon in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertCouponUpdatableFieldsEquals(partialUpdatedCoupon, getPersistedCoupon(partialUpdatedCoupon));
    }

    @Test
    @Transactional
    void patchNonExistingCoupon() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        coupon.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCouponMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, coupon.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(coupon))
            )
            .andExpect(status().isBadRequest());

        // Validate the Coupon in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCoupon() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        coupon.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCouponMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(coupon))
            )
            .andExpect(status().isBadRequest());

        // Validate the Coupon in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCoupon() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        coupon.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCouponMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(coupon)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Coupon in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCoupon() throws Exception {
        // Initialize the database
        insertedCoupon = couponRepository.saveAndFlush(coupon);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the coupon
        restCouponMockMvc
            .perform(delete(ENTITY_API_URL_ID, coupon.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return couponRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Coupon getPersistedCoupon(Coupon coupon) {
        return couponRepository.findById(coupon.getId()).orElseThrow();
    }

    protected void assertPersistedCouponToMatchAllProperties(Coupon expectedCoupon) {
        assertCouponAllPropertiesEquals(expectedCoupon, getPersistedCoupon(expectedCoupon));
    }

    protected void assertPersistedCouponToMatchUpdatableProperties(Coupon expectedCoupon) {
        assertCouponAllUpdatablePropertiesEquals(expectedCoupon, getPersistedCoupon(expectedCoupon));
    }
}
