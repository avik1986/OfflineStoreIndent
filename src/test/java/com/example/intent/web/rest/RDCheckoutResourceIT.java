package com.example.intent.web.rest;

import static com.example.intent.domain.RDCheckoutAsserts.*;
import static com.example.intent.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.intent.IntegrationTest;
import com.example.intent.domain.RDCheckout;
import com.example.intent.repository.RDCheckoutRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link RDCheckoutResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RDCheckoutResourceIT {

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_PAYMENT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_PAYMENT_STATUS = "BBBBBBBBBB";

    private static final String DEFAULT_ORDER_ID = "AAAAAAAAAA";
    private static final String UPDATED_ORDER_ID = "BBBBBBBBBB";

    private static final String DEFAULT_ORDER_DELIVERY_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_ORDER_DELIVERY_STATUS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/rd-checkouts";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private RDCheckoutRepository rDCheckoutRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRDCheckoutMockMvc;

    private RDCheckout rDCheckout;

    private RDCheckout insertedRDCheckout;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RDCheckout createEntity() {
        return new RDCheckout()
            .status(DEFAULT_STATUS)
            .paymentStatus(DEFAULT_PAYMENT_STATUS)
            .orderId(DEFAULT_ORDER_ID)
            .orderDeliveryStatus(DEFAULT_ORDER_DELIVERY_STATUS);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RDCheckout createUpdatedEntity() {
        return new RDCheckout()
            .status(UPDATED_STATUS)
            .paymentStatus(UPDATED_PAYMENT_STATUS)
            .orderId(UPDATED_ORDER_ID)
            .orderDeliveryStatus(UPDATED_ORDER_DELIVERY_STATUS);
    }

    @BeforeEach
    void initTest() {
        rDCheckout = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedRDCheckout != null) {
            rDCheckoutRepository.delete(insertedRDCheckout);
            insertedRDCheckout = null;
        }
    }

    @Test
    @Transactional
    void createRDCheckout() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the RDCheckout
        var returnedRDCheckout = om.readValue(
            restRDCheckoutMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(rDCheckout)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            RDCheckout.class
        );

        // Validate the RDCheckout in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertRDCheckoutUpdatableFieldsEquals(returnedRDCheckout, getPersistedRDCheckout(returnedRDCheckout));

        insertedRDCheckout = returnedRDCheckout;
    }

    @Test
    @Transactional
    void createRDCheckoutWithExistingId() throws Exception {
        // Create the RDCheckout with an existing ID
        rDCheckout.setId("existing_id");

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRDCheckoutMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(rDCheckout)))
            .andExpect(status().isBadRequest());

        // Validate the RDCheckout in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRDCheckouts() throws Exception {
        // Initialize the database
        insertedRDCheckout = rDCheckoutRepository.saveAndFlush(rDCheckout);

        // Get all the rDCheckoutList
        restRDCheckoutMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(rDCheckout.getId())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)))
            .andExpect(jsonPath("$.[*].paymentStatus").value(hasItem(DEFAULT_PAYMENT_STATUS)))
            .andExpect(jsonPath("$.[*].orderId").value(hasItem(DEFAULT_ORDER_ID)))
            .andExpect(jsonPath("$.[*].orderDeliveryStatus").value(hasItem(DEFAULT_ORDER_DELIVERY_STATUS)));
    }

    @Test
    @Transactional
    void getRDCheckout() throws Exception {
        // Initialize the database
        insertedRDCheckout = rDCheckoutRepository.saveAndFlush(rDCheckout);

        // Get the rDCheckout
        restRDCheckoutMockMvc
            .perform(get(ENTITY_API_URL_ID, rDCheckout.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(rDCheckout.getId()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS))
            .andExpect(jsonPath("$.paymentStatus").value(DEFAULT_PAYMENT_STATUS))
            .andExpect(jsonPath("$.orderId").value(DEFAULT_ORDER_ID))
            .andExpect(jsonPath("$.orderDeliveryStatus").value(DEFAULT_ORDER_DELIVERY_STATUS));
    }

    @Test
    @Transactional
    void getNonExistingRDCheckout() throws Exception {
        // Get the rDCheckout
        restRDCheckoutMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRDCheckout() throws Exception {
        // Initialize the database
        insertedRDCheckout = rDCheckoutRepository.saveAndFlush(rDCheckout);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the rDCheckout
        RDCheckout updatedRDCheckout = rDCheckoutRepository.findById(rDCheckout.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedRDCheckout are not directly saved in db
        em.detach(updatedRDCheckout);
        updatedRDCheckout
            .status(UPDATED_STATUS)
            .paymentStatus(UPDATED_PAYMENT_STATUS)
            .orderId(UPDATED_ORDER_ID)
            .orderDeliveryStatus(UPDATED_ORDER_DELIVERY_STATUS);

        restRDCheckoutMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRDCheckout.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedRDCheckout))
            )
            .andExpect(status().isOk());

        // Validate the RDCheckout in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedRDCheckoutToMatchAllProperties(updatedRDCheckout);
    }

    @Test
    @Transactional
    void putNonExistingRDCheckout() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        rDCheckout.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRDCheckoutMockMvc
            .perform(
                put(ENTITY_API_URL_ID, rDCheckout.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(rDCheckout))
            )
            .andExpect(status().isBadRequest());

        // Validate the RDCheckout in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRDCheckout() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        rDCheckout.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRDCheckoutMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(rDCheckout))
            )
            .andExpect(status().isBadRequest());

        // Validate the RDCheckout in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRDCheckout() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        rDCheckout.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRDCheckoutMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(rDCheckout)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the RDCheckout in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRDCheckoutWithPatch() throws Exception {
        // Initialize the database
        insertedRDCheckout = rDCheckoutRepository.saveAndFlush(rDCheckout);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the rDCheckout using partial update
        RDCheckout partialUpdatedRDCheckout = new RDCheckout();
        partialUpdatedRDCheckout.setId(rDCheckout.getId());

        partialUpdatedRDCheckout.status(UPDATED_STATUS).paymentStatus(UPDATED_PAYMENT_STATUS);

        restRDCheckoutMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRDCheckout.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedRDCheckout))
            )
            .andExpect(status().isOk());

        // Validate the RDCheckout in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertRDCheckoutUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedRDCheckout, rDCheckout),
            getPersistedRDCheckout(rDCheckout)
        );
    }

    @Test
    @Transactional
    void fullUpdateRDCheckoutWithPatch() throws Exception {
        // Initialize the database
        insertedRDCheckout = rDCheckoutRepository.saveAndFlush(rDCheckout);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the rDCheckout using partial update
        RDCheckout partialUpdatedRDCheckout = new RDCheckout();
        partialUpdatedRDCheckout.setId(rDCheckout.getId());

        partialUpdatedRDCheckout
            .status(UPDATED_STATUS)
            .paymentStatus(UPDATED_PAYMENT_STATUS)
            .orderId(UPDATED_ORDER_ID)
            .orderDeliveryStatus(UPDATED_ORDER_DELIVERY_STATUS);

        restRDCheckoutMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRDCheckout.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedRDCheckout))
            )
            .andExpect(status().isOk());

        // Validate the RDCheckout in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertRDCheckoutUpdatableFieldsEquals(partialUpdatedRDCheckout, getPersistedRDCheckout(partialUpdatedRDCheckout));
    }

    @Test
    @Transactional
    void patchNonExistingRDCheckout() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        rDCheckout.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRDCheckoutMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, rDCheckout.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(rDCheckout))
            )
            .andExpect(status().isBadRequest());

        // Validate the RDCheckout in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRDCheckout() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        rDCheckout.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRDCheckoutMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(rDCheckout))
            )
            .andExpect(status().isBadRequest());

        // Validate the RDCheckout in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRDCheckout() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        rDCheckout.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRDCheckoutMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(rDCheckout)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the RDCheckout in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRDCheckout() throws Exception {
        // Initialize the database
        insertedRDCheckout = rDCheckoutRepository.saveAndFlush(rDCheckout);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the rDCheckout
        restRDCheckoutMockMvc
            .perform(delete(ENTITY_API_URL_ID, rDCheckout.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return rDCheckoutRepository.count();
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

    protected RDCheckout getPersistedRDCheckout(RDCheckout rDCheckout) {
        return rDCheckoutRepository.findById(rDCheckout.getId()).orElseThrow();
    }

    protected void assertPersistedRDCheckoutToMatchAllProperties(RDCheckout expectedRDCheckout) {
        assertRDCheckoutAllPropertiesEquals(expectedRDCheckout, getPersistedRDCheckout(expectedRDCheckout));
    }

    protected void assertPersistedRDCheckoutToMatchUpdatableProperties(RDCheckout expectedRDCheckout) {
        assertRDCheckoutAllUpdatablePropertiesEquals(expectedRDCheckout, getPersistedRDCheckout(expectedRDCheckout));
    }
}
