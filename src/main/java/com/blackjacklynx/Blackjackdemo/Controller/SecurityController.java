package com.blackjacklynx.Blackjackdemo.Controller;

import com.blackjacklynx.Blackjackdemo.Entity.Account;
import com.blackjacklynx.Blackjackdemo.Storage.AccountStorage;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class SecurityController {
    private AccountStorage accountStorage;

    public SecurityController(AccountStorage accountStorage) {
        this.accountStorage = accountStorage;
    }


    @GetMapping("/login")
    public String showLoginPage(Model model) {
        if(checkForLogin())
            return "redirect:/";
        model.addAttribute("error", "");
        return "login";
    }

    @GetMapping("/create-account")
    public String showCreateAccountPage() {
        if(checkForLogin())
            return "redirect:/";
        return "create-account";
    }

    @PostMapping("/create-account")
    public String createAccount(String username, String password) {
        Account account = new Account(username, password, "USER", true, 5000);
        accountStorage.addAccount(account);
        return "redirect:/login";
    }



    public boolean checkForLogin() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return true;
        }
        return false;
    }



}
