package com.blackjacklynx.Blackjackdemo.Entity;

public class LeaderboardObj {
    private String username;
    private int chips;

    public LeaderboardObj(String username, int chips) {
        this.username = username;
        this.chips = chips;
    }

    public String getUsername() {
        return username;
    }

    public int getChips() {
        return chips;
    }
}
