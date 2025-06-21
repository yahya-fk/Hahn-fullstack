package org.example.backend.service.Impl;

import java.util.ArrayList;
import java.util.List;

import org.example.backend.dao.entity.Role;
import org.example.backend.dao.entity.User;
import org.example.backend.dao.repository.RoleRepository;
import org.example.backend.dao.repository.UserRepository;
import org.example.backend.service.AccountService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
@Service
@Transactional
@AllArgsConstructor
public class AccountServiceImpl implements AccountService {
    UserRepository userRepository;
    RoleRepository roleRepository;
    BCryptPasswordEncoder bCryptPasswordEncoder;
    @Override
    public User saveUser(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user=userRepository.save(user);
        addRoleToUser(user,roleRepository.findById("ORDINARY").get());
        return user;
    }

    @Override
    public Role saveRole(Role role) {
        return roleRepository.save(role);
    }

    @Override
    public List<Role> findAllRolesToUser(String username) {

        return userRepository.findRolesByUsername(username);
    }

    @Override
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User addRoleToUser(User user, Role role) {
        try {
            if(user.getRoles()==null) user.setRoles(new ArrayList<>());
            user.getRoles().add(role);
        }catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return userRepository.save(user);
    }

    @Override
    public User removeRoleFromUser(User user, Role role) {
        try {
            user.getRoles().remove(role);
        }catch (Exception e) {
            System.out.println(e.getMessage());
        }
        return userRepository.save(user);
    }

    @Override
    public User findUserByUsername(String username) {
        return userRepository.findById(username).orElse(null);
    }
}
