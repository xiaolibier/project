package com.jwcq.entity;

/**
 * Created by luotuo on 17-5-23.
 */

public class TravellingExpense extends Allowance{
    private String city;
    private float price;
    private String transportation;

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public String getTransportation() {
        return transportation;
    }

    public void setTransportation(String transportation) {
        this.transportation = transportation;
    }
}
