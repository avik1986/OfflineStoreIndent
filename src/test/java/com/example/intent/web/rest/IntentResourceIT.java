package com.example.intent.web.rest;

import static com.example.intent.domain.IntentAsserts.*;
import static com.example.intent.web.rest.TestUtil.createUpdateProxyForBean;
import static com.example.intent.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.example.intent.IntegrationTest;
import com.example.intent.domain.Intent;
import com.example.intent.repository.IntentRepository;
import com.example.intent.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link IntentResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class IntentResourceIT {

    private static final BigDecimal DEFAULT_COMMISSION = new BigDecimal(1);
    private static final BigDecimal UPDATED_COMMISSION = new BigDecimal(2);

    private static final Instant DEFAULT_CREATED_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_CREATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_CREATED_BY = "BBBBBBBBBB";

    private static final Instant DEFAULT_UPDATED_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UPDATED_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_UPDATED_BY = "AAAAAAAAAA";
    private static final String UPDATED_UPDATED_BY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/intents";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private IntentRepository intentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restIntentMockMvc;

    private Intent intent;

    private Intent insertedIntent;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Intent createEntity() {
        return new Intent()
            .commission(DEFAULT_COMMISSION)
            .createdTime(DEFAULT_CREATED_TIME)
            .createdBy(DEFAULT_CREATED_BY)
            .updatedTime(DEFAULT_UPDATED_TIME)
            .updatedBy(DEFAULT_UPDATED_BY);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Intent createUpdatedEntity() {
        return new Intent()
            .commission(UPDATED_COMMISSION)
            .createdTime(UPDATED_CREATED_TIME)
            .createdBy(UPDATED_CREATED_BY)
            .updatedTime(UPDATED_UPDATED_TIME)
            .updatedBy(UPDATED_UPDATED_BY);
    }

    @BeforeEach
    void initTest() {
        intent = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedIntent != null) {
            intentRepository.delete(insertedIntent);
            insertedIntent = null;
        }
    }

    @Test
    @Transactional
    void createIntent() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Intent
        var returnedIntent = om.readValue(
            restIntentMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(intent)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Intent.class
        );

        // Validate the Intent in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertIntentUpdatableFieldsEquals(returnedIntent, getPersistedIntent(returnedIntent));

        insertedIntent = returnedIntent;
    }

    @Test
    @Transactional
    void createIntentWithExistingId() throws Exception {
        // Create the Intent with an existing ID
        insertedIntent = intentRepository.saveAndFlush(intent);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restIntentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(intent)))
            .andExpect(status().isBadRequest());

        // Validate the Intent in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCreatedTimeIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        intent.setCreatedTime(null);

        // Create the Intent, which fails.

        restIntentMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(intent)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllIntents() throws Exception {
        // Initialize the database
        insertedIntent = intentRepository.saveAndFlush(intent);

        // Get all the intentList
        restIntentMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(intent.getId().toString())))
            .andExpect(jsonPath("$.[*].commission").value(hasItem(sameNumber(DEFAULT_COMMISSION))))
            .andExpect(jsonPath("$.[*].createdTime").value(hasItem(DEFAULT_CREATED_TIME.toString())))
            .andExpect(jsonPath("$.[*].createdBy").value(hasItem(DEFAULT_CREATED_BY)))
            .andExpect(jsonPath("$.[*].updatedTime").value(hasItem(DEFAULT_UPDATED_TIME.toString())))
            .andExpect(jsonPath("$.[*].updatedBy").value(hasItem(DEFAULT_UPDATED_BY)));
    }

    @Test
    @Transactional
    void getIntent() throws Exception {
        // Initialize the database
        insertedIntent = intentRepository.saveAndFlush(intent);

        // Get the intent
        restIntentMockMvc
            .perform(get(ENTITY_API_URL_ID, intent.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(intent.getId().toString()))
            .andExpect(jsonPath("$.commission").value(sameNumber(DEFAULT_COMMISSION)))
            .andExpect(jsonPath("$.createdTime").value(DEFAULT_CREATED_TIME.toString()))
            .andExpect(jsonPath("$.createdBy").value(DEFAULT_CREATED_BY))
            .andExpect(jsonPath("$.updatedTime").value(DEFAULT_UPDATED_TIME.toString()))
            .andExpect(jsonPath("$.updatedBy").value(DEFAULT_UPDATED_BY));
    }

    @Test
    @Transactional
    void getNonExistingIntent() throws Exception {
        // Get the intent
        restIntentMockMvc.perform(get(ENTITY_API_URL_ID, UUID.randomUUID().toString())).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingIntent() throws Exception {
        // Initialize the database
        insertedIntent = intentRepository.saveAndFlush(intent);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the intent
        Intent updatedIntent = intentRepository.findById(intent.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedIntent are not directly saved in db
        em.detach(updatedIntent);
        updatedIntent
            .commission(UPDATED_COMMISSION)
            .createdTime(UPDATED_CREATED_TIME)
            .createdBy(UPDATED_CREATED_BY)
            .updatedTime(UPDATED_UPDATED_TIME)
            .updatedBy(UPDATED_UPDATED_BY);

        restIntentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedIntent.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedIntent))
            )
            .andExpect(status().isOk());

        // Validate the Intent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedIntentToMatchAllProperties(updatedIntent);
    }

    @Test
    @Transactional
    void putNonExistingIntent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        intent.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIntentMockMvc
            .perform(put(ENTITY_API_URL_ID, intent.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(intent)))
            .andExpect(status().isBadRequest());

        // Validate the Intent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchIntent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        intent.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIntentMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(intent))
            )
            .andExpect(status().isBadRequest());

        // Validate the Intent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamIntent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        intent.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIntentMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(intent)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Intent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateIntentWithPatch() throws Exception {
        // Initialize the database
        insertedIntent = intentRepository.saveAndFlush(intent);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the intent using partial update
        Intent partialUpdatedIntent = new Intent();
        partialUpdatedIntent.setId(intent.getId());

        partialUpdatedIntent
            .commission(UPDATED_COMMISSION)
            .createdTime(UPDATED_CREATED_TIME)
            .createdBy(UPDATED_CREATED_BY)
            .updatedTime(UPDATED_UPDATED_TIME)
            .updatedBy(UPDATED_UPDATED_BY);

        restIntentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIntent.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedIntent))
            )
            .andExpect(status().isOk());

        // Validate the Intent in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertIntentUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedIntent, intent), getPersistedIntent(intent));
    }

    @Test
    @Transactional
    void fullUpdateIntentWithPatch() throws Exception {
        // Initialize the database
        insertedIntent = intentRepository.saveAndFlush(intent);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the intent using partial update
        Intent partialUpdatedIntent = new Intent();
        partialUpdatedIntent.setId(intent.getId());

        partialUpdatedIntent
            .commission(UPDATED_COMMISSION)
            .createdTime(UPDATED_CREATED_TIME)
            .createdBy(UPDATED_CREATED_BY)
            .updatedTime(UPDATED_UPDATED_TIME)
            .updatedBy(UPDATED_UPDATED_BY);

        restIntentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedIntent.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedIntent))
            )
            .andExpect(status().isOk());

        // Validate the Intent in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertIntentUpdatableFieldsEquals(partialUpdatedIntent, getPersistedIntent(partialUpdatedIntent));
    }

    @Test
    @Transactional
    void patchNonExistingIntent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        intent.setId(UUID.randomUUID());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restIntentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, intent.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(intent))
            )
            .andExpect(status().isBadRequest());

        // Validate the Intent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchIntent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        intent.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIntentMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(intent))
            )
            .andExpect(status().isBadRequest());

        // Validate the Intent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamIntent() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        intent.setId(UUID.randomUUID());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restIntentMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(intent)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Intent in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteIntent() throws Exception {
        // Initialize the database
        insertedIntent = intentRepository.saveAndFlush(intent);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the intent
        restIntentMockMvc
            .perform(delete(ENTITY_API_URL_ID, intent.getId().toString()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return intentRepository.count();
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

    protected Intent getPersistedIntent(Intent intent) {
        return intentRepository.findById(intent.getId()).orElseThrow();
    }

    protected void assertPersistedIntentToMatchAllProperties(Intent expectedIntent) {
        assertIntentAllPropertiesEquals(expectedIntent, getPersistedIntent(expectedIntent));
    }

    protected void assertPersistedIntentToMatchUpdatableProperties(Intent expectedIntent) {
        assertIntentAllUpdatablePropertiesEquals(expectedIntent, getPersistedIntent(expectedIntent));
    }
}
