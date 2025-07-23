package com.example.intent.web.rest;

import static com.example.intent.domain.StoreAsserts.*;
import static com.example.intent.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.intent.IntegrationTest;
import com.example.intent.domain.Store;
import com.example.intent.repository.StoreRepository;
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
 * Integration tests for the {@link StoreResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StoreResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/stores";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStoreMockMvc;

    private Store store;

    private Store insertedStore;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Store createEntity() {
        return new Store().name(DEFAULT_NAME);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Store createUpdatedEntity() {
        return new Store().name(UPDATED_NAME);
    }

    @BeforeEach
    void initTest() {
        store = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedStore != null) {
            storeRepository.delete(insertedStore);
            insertedStore = null;
        }
    }

    @Test
    @Transactional
    void createStore() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Store
        var returnedStore = om.readValue(
            restStoreMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(store)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Store.class
        );

        // Validate the Store in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertStoreUpdatableFieldsEquals(returnedStore, getPersistedStore(returnedStore));

        insertedStore = returnedStore;
    }

    @Test
    @Transactional
    void createStoreWithExistingId() throws Exception {
        // Create the Store with an existing ID
        insertedStore = storeRepository.saveAndFlush(store);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStoreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(store)))
            .andExpect(status().isBadRequest());

        // Validate the Store in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllStores() throws Exception {
        // Initialize the database
        insertedStore = storeRepository.saveAndFlush(store);

        // Get all the storeList
        restStoreMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(store.getId().toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getStore() throws Exception {
        // Initialize the database
        insertedStore = storeRepository.saveAndFlush(store);

        // Get the store
        restStoreMockMvc
            .perform(get(ENTITY_API_URL_ID, store.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(store.getId().toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingStore() throws Exception {
        // Get the store
        restStoreMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingStore() throws Exception {
        // Initialize the database
        insertedStore = storeRepository.saveAndFlush(store);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the store
        Store updatedStore = storeRepository.findById(store.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedStore are not directly saved in db
        em.detach(updatedStore);
        updatedStore.name(UPDATED_NAME);

        restStoreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStore.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedStore))
            )
            .andExpect(status().isOk());

        // Validate the Store in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedStoreToMatchAllProperties(updatedStore);
    }

    @Test
    @Transactional
    void putNonExistingStore() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        store.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStoreMockMvc
            .perform(put(ENTITY_API_URL_ID, store.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(store)))
            .andExpect(status().isBadRequest());

        // Validate the Store in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStore() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        store.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreMockMvc
            .perform(put(ENTITY_API_URL_ID, UUID.randomUUID()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(store)))
            .andExpect(status().isBadRequest());

        // Validate the Store in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStore() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        store.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(store)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Store in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStoreWithPatch() throws Exception {
        // Initialize the database
        insertedStore = storeRepository.saveAndFlush(store);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the store using partial update
        Store partialUpdatedStore = new Store();
        partialUpdatedStore.setId(store.getId());

        partialUpdatedStore.name(UPDATED_NAME);

        restStoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStore.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedStore))
            )
            .andExpect(status().isOk());

        // Validate the Store in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertStoreUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedStore, store), getPersistedStore(store));
    }

    @Test
    @Transactional
    void fullUpdateStoreWithPatch() throws Exception {
        // Initialize the database
        insertedStore = storeRepository.saveAndFlush(store);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the store using partial update
        Store partialUpdatedStore = new Store();
        partialUpdatedStore.setId(store.getId());

        partialUpdatedStore.name(UPDATED_NAME);

        restStoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStore.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedStore))
            )
            .andExpect(status().isOk());

        // Validate the Store in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertStoreUpdatableFieldsEquals(partialUpdatedStore, getPersistedStore(partialUpdatedStore));
    }

    @Test
    @Transactional
    void patchNonExistingStore() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        store.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, store.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(store))
            )
            .andExpect(status().isBadRequest());

        // Validate the Store in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStore() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        store.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(store))
            )
            .andExpect(status().isBadRequest());

        // Validate the Store in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStore() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        store.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(store)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Store in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStore() throws Exception {
        // Initialize the database
        insertedStore = storeRepository.saveAndFlush(store);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the store
        restStoreMockMvc
            .perform(delete(ENTITY_API_URL_ID, store.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return storeRepository.count();
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

    protected Store getPersistedStore(Store store) {
        return storeRepository.findById(store.getId()).orElseThrow();
    }

    protected void assertPersistedStoreToMatchAllProperties(Store expectedStore) {
        assertStoreAllPropertiesEquals(expectedStore, getPersistedStore(expectedStore));
    }

    protected void assertPersistedStoreToMatchUpdatableProperties(Store expectedStore) {
        assertStoreAllUpdatablePropertiesEquals(expectedStore, getPersistedStore(expectedStore));
    }
}
