package org.example.backend.service;


import org.example.backend.dao.entity.Role;
import org.example.backend.dao.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AccountService {
    User saveUser(User user);
    Role saveRole(Role role);
    List<Role> findAllRolesToUser(String username);
    List<User> findAllUsers();
    User addRoleToUser(User user, Role role);
    User removeRoleFromUser(User user, Role role);
    User findUserByUsername(String username);
}
