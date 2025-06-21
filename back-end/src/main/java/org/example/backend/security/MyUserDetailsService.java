package org.example.backend.security;

import java.util.ArrayList;
import java.util.List;

import org.example.backend.dao.entity.User;
import org.example.backend.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {
    @Autowired
    AccountService accountService;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = accountService.findUserByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException(username);
        }else {
            List<GrantedAuthority> grantedAuthorities = new ArrayList<>();
            user.getRoles().forEach(role -> {
                GrantedAuthority grantedAuthority = new SimpleGrantedAuthority(role.getRole());
                grantedAuthorities.add(grantedAuthority);
            });
            return new org.springframework.security.core.userdetails.User(
                    user.getUsername(),
                    user.getPassword(),
                    grantedAuthorities);
        }

    }


}
