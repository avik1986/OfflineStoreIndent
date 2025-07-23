package com.example.intent.web.rest;

import com.example.intent.domain.StoreManager;
import com.example.intent.repository.StoreManagerRepository;
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
 * REST controller for managing {@link com.example.intent.domain.StoreManager}.
 */
@RestController
@RequestMapping("/api/store-managers")
@Transactional
public class StoreManagerResource {

    private static final Logger LOG = LoggerFactory.getLogger(StoreManagerResource.class);

    private static final String ENTITY_NAME = "storeManager";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StoreManagerRepository storeManagerRepository;

    public StoreManagerResource(StoreManagerRepository storeManagerRepository) {
        this.storeManagerRepository = storeManagerRepository;
    }

    /**
     * {@code POST  /store-managers} : Create a new storeManager.
     *
     * @param storeManager the storeManager to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new storeManager, or with status {@code 400 (Bad Request)} if the storeManager has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<StoreManager> createStoreManager(@Valid @RequestBody StoreManager storeManager) throws URISyntaxException {
        LOG.debug("REST request to save StoreManager : {}", storeManager);
        if (storeManager.getId() != null) {
            throw new BadRequestAlertException("A new storeManager cannot already have an ID", ENTITY_NAME, "idexists");
        }
        storeManager = storeManagerRepository.save(storeManager);
        return ResponseEntity.created(new URI("/api/store-managers/" + storeManager.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, storeManager.getId().toString()))
            .body(storeManager);
    }

    /**
     * {@code PUT  /store-managers/:id} : Updates an existing storeManager.
     *
     * @param id the id of the storeManager to save.
     * @param storeManager the storeManager to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated storeManager,
     * or with status {@code 400 (Bad Request)} if the storeManager is not valid,
     * or with status {@code 500 (Internal Server Error)} if the storeManager couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<StoreManager> updateStoreManager(
        @PathVariable(value = "id", required = false) final UUID id,
        @Valid @RequestBody StoreManager storeManager
    ) throws URISyntaxException {
        LOG.debug("REST request to update StoreManager : {}, {}", id, storeManager);
        if (storeManager.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, storeManager.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!storeManagerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        storeManager = storeManagerRepository.save(storeManager);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, storeManager.getId().toString()))
            .body(storeManager);
    }

    /**
     * {@code PATCH  /store-managers/:id} : Partial updates given fields of an existing storeManager, field will ignore if it is null
     *
     * @param id the id of the storeManager to save.
     * @param storeManager the storeManager to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated storeManager,
     * or with status {@code 400 (Bad Request)} if the storeManager is not valid,
     * or with status {@code 404 (Not Found)} if the storeManager is not found,
     * or with status {@code 500 (Internal Server Error)} if the storeManager couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<StoreManager> partialUpdateStoreManager(
        @PathVariable(value = "id", required = false) final UUID id,
        @NotNull @RequestBody StoreManager storeManager
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update StoreManager partially : {}, {}", id, storeManager);
        if (storeManager.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, storeManager.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!storeManagerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<StoreManager> result = storeManagerRepository
            .findById(storeManager.getId())
            .map(existingStoreManager -> {
                if (storeManager.getName() != null) {
                    existingStoreManager.setName(storeManager.getName());
                }

                return existingStoreManager;
            })
            .map(storeManagerRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, storeManager.getId().toString())
        );
    }

    /**
     * {@code GET  /store-managers} : get all the storeManagers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of storeManagers in body.
     */
    @GetMapping("")
    public List<StoreManager> getAllStoreManagers() {
        LOG.debug("REST request to get all StoreManagers");
        return storeManagerRepository.findAll();
    }

    /**
     * {@code GET  /store-managers/:id} : get the "id" storeManager.
     *
     * @param id the id of the storeManager to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the storeManager, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<StoreManager> getStoreManager(@PathVariable("id") UUID id) {
        LOG.debug("REST request to get StoreManager : {}", id);
        Optional<StoreManager> storeManager = storeManagerRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(storeManager);
    }

    /**
     * {@code DELETE  /store-managers/:id} : delete the "id" storeManager.
     *
     * @param id the id of the storeManager to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStoreManager(@PathVariable("id") UUID id) {
        LOG.debug("REST request to delete StoreManager : {}", id);
        storeManagerRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
