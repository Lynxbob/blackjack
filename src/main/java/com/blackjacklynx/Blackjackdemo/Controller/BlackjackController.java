package com.blackjacklynx.Blackjackdemo.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BlackjackController {


    @GetMapping("/")
    public String displayHomeview() {
        return "blackjack";
    }



    @GetMapping("/leaderboard")
    public String displayLeaderboard() {
        return "leaderboard";
    }
}
