package com.example.intent.web.rest;

import com.example.intent.domain.Intent;
import com.example.intent.repository.IntentRepository;
import com.example.intent.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.example.intent.domain.Intent}.
 */
@RestController
@RequestMapping("/api/intents")
@Transactional
public class IntentResource {

    private static final Logger LOG = LoggerFactory.getLogger(IntentResource.class);

    private static final String ENTITY_NAME = "intent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final IntentRepository intentRepository;

    public IntentResource(IntentRepository intentRepository) {
        this.intentRepository = intentRepository;
    }

    /**
     * {@code POST  /intents} : Create a new intent.
     *
     * @param intent the intent to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new intent, or with status {@code 400 (Bad Request)} if the intent has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Intent> createIntent(@Valid @RequestBody Intent intent) throws URISyntaxException {
        LOG.debug("REST request to save Intent : {}", intent);
        if (intent.getId() != null) {
            throw new BadRequestAlertException("A new intent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        intent = intentRepository.save(intent);
        return ResponseEntity.created(new URI("/api/intents/" + intent.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, intent.getId().toString()))
            .body(intent);
    }

    /**
     * {@code PUT  /intents/:id} : Updates an existing intent.
     *
     * @param id the id of the intent to save.
     * @param intent the intent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated intent,
     * or with status {@code 400 (Bad Request)} if the intent is not valid,
     * or with status {@code 500 (Internal Server Error)} if the intent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Intent> updateIntent(
        @PathVariable(value = "id", required = false) final UUID id,
        @Valid @RequestBody Intent intent
    ) throws URISyntaxException {
        LOG.debug("REST request to update Intent : {}, {}", id, intent);
        if (intent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, intent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!intentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        intent = intentRepository.save(intent);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, intent.getId().toString()))
            .body(intent);
    }

    /**
     * {@code PATCH  /intents/:id} : Partial updates given fields of an existing intent, field will ignore if it is null
     *
     * @param id the id of the intent to save.
     * @param intent the intent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated intent,
     * or with status {@code 400 (Bad Request)} if the intent is not valid,
     * or with status {@code 404 (Not Found)} if the intent is not found,
     * or with status {@code 500 (Internal Server Error)} if the intent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Intent> partialUpdateIntent(
        @PathVariable(value = "id", required = false) final UUID id,
        @NotNull @RequestBody Intent intent
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Intent partially : {}, {}", id, intent);
        if (intent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, intent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!intentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Intent> result = intentRepository
            .findById(intent.getId())
            .map(existingIntent -> {
                if (intent.getCommission() != null) {
                    existingIntent.setCommission(intent.getCommission());
                }
                if (intent.getCreatedTime() != null) {
                    existingIntent.setCreatedTime(intent.getCreatedTime());
                }
                if (intent.getCreatedBy() != null) {
                    existingIntent.setCreatedBy(intent.getCreatedBy());
                }
                if (intent.getUpdatedTime() != null) {
                    existingIntent.setUpdatedTime(intent.getUpdatedTime());
                }
                if (intent.getUpdatedBy() != null) {
                    existingIntent.setUpdatedBy(intent.getUpdatedBy());
                }

                return existingIntent;
            })
            .map(intentRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, intent.getId().toString())
        );
    }

    /**
     * {@code GET  /intents} : get all the intents.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of intents in body.
     */
    @GetMapping("")
    public List<Intent> getAllIntents() {
        LOG.debug("REST request to get all Intents");
        return intentRepository.findAll();
    }

    /**
     * {@code GET  /intents/:id} : get the "id" intent.
     *
     * @param id the id of the intent to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the intent, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Intent> getIntent(@PathVariable("id") UUID id) {
        LOG.debug("REST request to get Intent : {}", id);
        Optional<Intent> intent = intentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(intent);
    }

    /**
     * {@code DELETE  /intents/:id} : delete the "id" intent.
     *
     * @param id the id of the intent to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIntent(@PathVariable("id") UUID id) {
        LOG.debug("REST request to delete Intent : {}", id);
        intentRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
