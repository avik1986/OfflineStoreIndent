package com.example.intent.web.rest;

import static com.example.intent.domain.StoreManagerAsserts.*;
import static com.example.intent.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.intent.IntegrationTest;
import com.example.intent.domain.StoreManager;
import com.example.intent.repository.StoreManagerRepository;
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
 * Integration tests for the {@link StoreManagerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StoreManagerResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/store-managers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private StoreManagerRepository storeManagerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStoreManagerMockMvc;

    private StoreManager storeManager;

    private StoreManager insertedStoreManager;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StoreManager createEntity() {
        return new StoreManager().name(DEFAULT_NAME);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static StoreManager createUpdatedEntity() {
        return new StoreManager().name(UPDATED_NAME);
    }

    @BeforeEach
    void initTest() {
        storeManager = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedStoreManager != null) {
            storeManagerRepository.delete(insertedStoreManager);
            insertedStoreManager = null;
        }
    }

    @Test
    @Transactional
    void createStoreManager() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the StoreManager
        var returnedStoreManager = om.readValue(
            restStoreManagerMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(storeManager)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            StoreManager.class
        );

        // Validate the StoreManager in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertStoreManagerUpdatableFieldsEquals(returnedStoreManager, getPersistedStoreManager(returnedStoreManager));

        insertedStoreManager = returnedStoreManager;
    }

    @Test
    @Transactional
    void createStoreManagerWithExistingId() throws Exception {
        // Create the StoreManager with an existing ID
        insertedStoreManager = storeManagerRepository.saveAndFlush(storeManager);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStoreManagerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(storeManager)))
            .andExpect(status().isBadRequest());

        // Validate the StoreManager in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllStoreManagers() throws Exception {
        // Initialize the database
        insertedStoreManager = storeManagerRepository.saveAndFlush(storeManager);

        // Get all the storeManagerList
        restStoreManagerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(storeManager.getId().toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getStoreManager() throws Exception {
        // Initialize the database
        insertedStoreManager = storeManagerRepository.saveAndFlush(storeManager);

        // Get the storeManager
        restStoreManagerMockMvc
            .perform(get(ENTITY_API_URL_ID, storeManager.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(storeManager.getId().toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingStoreManager() throws Exception {
        // Get the storeManager
        restStoreManagerMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingStoreManager() throws Exception {
        // Initialize the database
        insertedStoreManager = storeManagerRepository.saveAndFlush(storeManager);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the storeManager
        StoreManager updatedStoreManager = storeManagerRepository.findById(storeManager.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedStoreManager are not directly saved in db
        em.detach(updatedStoreManager);
        updatedStoreManager.name(UPDATED_NAME);

        restStoreManagerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStoreManager.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedStoreManager))
            )
            .andExpect(status().isOk());

        // Validate the StoreManager in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedStoreManagerToMatchAllProperties(updatedStoreManager);
    }

    @Test
    @Transactional
    void putNonExistingStoreManager() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        storeManager.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStoreManagerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, storeManager.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(storeManager))
            )
            .andExpect(status().isBadRequest());

        // Validate the StoreManager in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStoreManager() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        storeManager.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreManagerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(storeManager))
            )
            .andExpect(status().isBadRequest());

        // Validate the StoreManager in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStoreManager() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        storeManager.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreManagerMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(storeManager)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the StoreManager in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStoreManagerWithPatch() throws Exception {
        // Initialize the database
        insertedStoreManager = storeManagerRepository.saveAndFlush(storeManager);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the storeManager using partial update
        StoreManager partialUpdatedStoreManager = new StoreManager();
        partialUpdatedStoreManager.setId(storeManager.getId());

        restStoreManagerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStoreManager.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedStoreManager))
            )
            .andExpect(status().isOk());

        // Validate the StoreManager in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertStoreManagerUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedStoreManager, storeManager),
            getPersistedStoreManager(storeManager)
        );
    }

    @Test
    @Transactional
    void fullUpdateStoreManagerWithPatch() throws Exception {
        // Initialize the database
        insertedStoreManager = storeManagerRepository.saveAndFlush(storeManager);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the storeManager using partial update
        StoreManager partialUpdatedStoreManager = new StoreManager();
        partialUpdatedStoreManager.setId(storeManager.getId());

        partialUpdatedStoreManager.name(UPDATED_NAME);

        restStoreManagerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStoreManager.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedStoreManager))
            )
            .andExpect(status().isOk());

        // Validate the StoreManager in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertStoreManagerUpdatableFieldsEquals(partialUpdatedStoreManager, getPersistedStoreManager(partialUpdatedStoreManager));
    }

    @Test
    @Transactional
    void patchNonExistingStoreManager() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        storeManager.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStoreManagerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, storeManager.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(storeManager))
            )
            .andExpect(status().isBadRequest());

        // Validate the StoreManager in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStoreManager() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        storeManager.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreManagerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(storeManager))
            )
            .andExpect(status().isBadRequest());

        // Validate the StoreManager in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStoreManager() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        storeManager.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStoreManagerMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(storeManager)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the StoreManager in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStoreManager() throws Exception {
        // Initialize the database
        insertedStoreManager = storeManagerRepository.saveAndFlush(storeManager);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the storeManager
        restStoreManagerMockMvc
            .perform(delete(ENTITY_API_URL_ID, storeManager.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return storeManagerRepository.count();
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

    protected StoreManager getPersistedStoreManager(StoreManager storeManager) {
        return storeManagerRepository.findById(storeManager.getId()).orElseThrow();
    }

    protected void assertPersistedStoreManagerToMatchAllProperties(StoreManager expectedStoreManager) {
        assertStoreManagerAllPropertiesEquals(expectedStoreManager, getPersistedStoreManager(expectedStoreManager));
    }

    protected void assertPersistedStoreManagerToMatchUpdatableProperties(StoreManager expectedStoreManager) {
        assertStoreManagerAllUpdatablePropertiesEquals(expectedStoreManager, getPersistedStoreManager(expectedStoreManager));
    }
}
