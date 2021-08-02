package com.blackjacklynx.Blackjackdemo.Entity;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.web.bind.annotation.GetMapping;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Account {

    @Id
    @GeneratedValue
    private long id;
    private String username;
    private String password;
    private String roles;
    private boolean statusServerSide;
    private int chips;

    protected Account() {

    }

    public Account(String username, String password, String roles, boolean statusServerSide, int chips) {
        this.username = username;
        this.password = password;
        this.roles = roles;
        this.statusServerSide = statusServerSide;
        this.chips = chips;
    }

    public long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getRoles() {
        return roles;
    }

    public boolean isStatusServerSide() {
        return statusServerSide;
    }

    public int getChips() {
        return chips;
    }
}
