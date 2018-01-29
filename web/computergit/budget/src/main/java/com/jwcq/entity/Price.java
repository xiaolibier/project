package com.jwcq.entity;

import javax.persistence.*;


/**
 * Created by luotuo on 17-5-19.
 */


@Entity
@Table(name = "price")
public class Price {
    @Id
    @GeneratedValue
    private long id;
    private String city;
    private float plane_price;
    private float train_price;
    private String default_transportation;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public float getPlane_price() {
        return plane_price;
    }

    public void setPlane_price(float plane_price) {
        this.plane_price = plane_price;
    }

    public float getTrain_price() {
        return train_price;
    }

    public void setTrain_price(float train_price) {
        this.train_price = train_price;
    }

    public String getDefault_transportation() {
        return default_transportation;
    }

    public void setDefault_transportation(String default_transportation) {
        this.default_transportation = default_transportation;
    }
}
