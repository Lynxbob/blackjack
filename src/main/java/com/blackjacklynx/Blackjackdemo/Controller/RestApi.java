package com.blackjacklynx.Blackjackdemo.Controller;

import com.blackjacklynx.Blackjackdemo.Entity.Account;
import com.blackjacklynx.Blackjackdemo.Entity.LeaderboardObj;
import com.blackjacklynx.Blackjackdemo.Storage.AccountStorage;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.reflect.Array;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

@RestController
public class RestApi {
    private AccountStorage accountStorage;


    public RestApi(AccountStorage accountStorage) {
        this.accountStorage = accountStorage;
    }




    @GetMapping("/api/chips")
    public int retrieveChipAmount(Principal principal) {
        Account account = accountStorage.retrieveAccountByUsername(principal.getName());
        return account.getChips();
    }


    @PostMapping("/api/chips")
    public boolean saveChips(int chipCount, Principal principal) {
        Account account = accountStorage.retrieveAccountByUsername(principal.getName());
        account.setChips(chipCount);
        accountStorage.addAccount(account);
        return true;
    }

    @GetMapping("/api/leaderboard")
    public ArrayList<LeaderboardObj> sendLeaderboardList() {
        return sortAccountsByChips();

    }


    public ArrayList<LeaderboardObj> sortAccountsByChips() {
        ArrayList<LeaderboardObj> temp = new ArrayList<>();
        for(Account account: accountStorage.retrieveAllAccounts()) {
            LeaderboardObj placeholderObj = new LeaderboardObj(account.getUsername(), account.getChips());
            temp.add(placeholderObj);
        }
        Collections.sort(temp, new Comparator<LeaderboardObj>() {
            @Override
            public int compare(LeaderboardObj o1, LeaderboardObj o2) {
                Integer int1 = o1.getChips();
                Integer int2 = o2.getChips();
                return int2.compareTo(int1);
            }
        });
        return temp;
    }
}
