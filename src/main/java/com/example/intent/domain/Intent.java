package com.example.intent.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Intent.
 */
@Entity
@Table(name = "intent")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Intent implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "commission", precision = 21, scale = 2)
    private BigDecimal commission;

    @NotNull
    @Column(name = "created_time", nullable = false)
    private Instant createdTime;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_time")
    private Instant updatedTime;

    @Column(name = "updated_by")
    private String updatedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    private Article article;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    private StoreManager storeManager;

    @ManyToOne(fetch = FetchType.LAZY)
    private Store store;

    @ManyToOne(fetch = FetchType.LAZY)
    private Coupon coupon;

    @ManyToOne(fetch = FetchType.LAZY)
    private RDCheckout rdCheckout;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public UUID getId() {
        return this.id;
    }

    public Intent id(UUID id) {
        this.setId(id);
        return this;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public BigDecimal getCommission() {
        return this.commission;
    }

    public Intent commission(BigDecimal commission) {
        this.setCommission(commission);
        return this;
    }

    public void setCommission(BigDecimal commission) {
        this.commission = commission;
    }

    public Instant getCreatedTime() {
        return this.createdTime;
    }

    public Intent createdTime(Instant createdTime) {
        this.setCreatedTime(createdTime);
        return this;
    }

    public void setCreatedTime(Instant createdTime) {
        this.createdTime = createdTime;
    }

    public String getCreatedBy() {
        return this.createdBy;
    }

    public Intent createdBy(String createdBy) {
        this.setCreatedBy(createdBy);
        return this;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Instant getUpdatedTime() {
        return this.updatedTime;
    }

    public Intent updatedTime(Instant updatedTime) {
        this.setUpdatedTime(updatedTime);
        return this;
    }

    public void setUpdatedTime(Instant updatedTime) {
        this.updatedTime = updatedTime;
    }

    public String getUpdatedBy() {
        return this.updatedBy;
    }

    public Intent updatedBy(String updatedBy) {
        this.setUpdatedBy(updatedBy);
        return this;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public Article getArticle() {
        return this.article;
    }

    public void setArticle(Article article) {
        this.article = article;
    }

    public Intent article(Article article) {
        this.setArticle(article);
        return this;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Intent user(User user) {
        this.setUser(user);
        return this;
    }

    public StoreManager getStoreManager() {
        return this.storeManager;
    }

    public void setStoreManager(StoreManager storeManager) {
        this.storeManager = storeManager;
    }

    public Intent storeManager(StoreManager storeManager) {
        this.setStoreManager(storeManager);
        return this;
    }

    public Store getStore() {
        return this.store;
    }

    public void setStore(Store store) {
        this.store = store;
    }

    public Intent store(Store store) {
        this.setStore(store);
        return this;
    }

    public Coupon getCoupon() {
        return this.coupon;
    }

    public void setCoupon(Coupon coupon) {
        this.coupon = coupon;
    }

    public Intent coupon(Coupon coupon) {
        this.setCoupon(coupon);
        return this;
    }

    public RDCheckout getRdCheckout() {
        return this.rdCheckout;
    }

    public void setRdCheckout(RDCheckout rDCheckout) {
        this.rdCheckout = rDCheckout;
    }

    public Intent rdCheckout(RDCheckout rDCheckout) {
        this.setRdCheckout(rDCheckout);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Intent)) {
            return false;
        }
        return getId() != null && getId().equals(((Intent) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Intent{" +
            "id=" + getId() +
            ", commission=" + getCommission() +
            ", createdTime='" + getCreatedTime() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", updatedTime='" + getUpdatedTime() + "'" +
            ", updatedBy='" + getUpdatedBy() + "'" +
            "}";
    }
}
