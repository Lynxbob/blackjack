package com.blackjacklynx.Blackjackdemo.Storage;


import com.blackjacklynx.Blackjackdemo.Entity.Account;
import com.blackjacklynx.Blackjackdemo.Repo.AccountRepository;
import org.springframework.stereotype.Service;

@Service
public class AccountStorage{
    private AccountRepository accountRepo;
    public AccountStorage (AccountRepository accountRepo){
        this.accountRepo = accountRepo;

    }

    public void addAccount(Account accountToAdd) {
        accountRepo.save(accountToAdd);
    }
    public Account retrieveAccountById(Long id) { return accountRepo.findById(id).get();}
    public void deleteAccountById(Long id) {accountRepo.deleteById(id);}
    public Iterable<Account> retrieveAllAccounts() {
        return accountRepo.findAll();
    }

    public Account retrieveAccountByUsername(String username) {
        return accountRepo.findByUsername(username).get();
    }
}
