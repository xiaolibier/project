package com.jwcq.entity;


/**
 * Created by luotuo on 17-5-23.
 */


public class AllowanceByLevel{
    protected float rate;
    protected float technical_allowance;
    protected float food_allowance;
    protected float communication_allowance;
    protected float transportation_allowance;

    public float getRate() {
        return rate;
    }

    public void setRate(float rate) {
        this.rate = rate;
    }

    public float getTechnical_allowance() {
        return technical_allowance;
    }

    public void setTechnical_allowance(float technical_allowance) {
        this.technical_allowance = technical_allowance;
    }

    public float getFood_allowance() {
        return food_allowance;
    }

    public void setFood_allowance(float food_allowance) {
        this.food_allowance = food_allowance;
    }

    public float getCommunication_allowance() {
        return communication_allowance;
    }

    public void setCommunication_allowance(float communication_allowance) {
        this.communication_allowance = communication_allowance;
    }

    public float getTransportation_allowance() {
        return transportation_allowance;
    }

    public void setTransportation_allowance(float transportation_allowance) {
        this.transportation_allowance = transportation_allowance;
    }
}
