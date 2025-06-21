package org.example.backend.service;

import org.example.backend.dto.CreateUserDto;
import org.example.backend.dto.UpdateUserDto;
import org.example.backend.dto.UserDto;
import org.example.backend.dto.UserRoleDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserManagementService {
    UserDto createUser(CreateUserDto createUserDto);
    UserDto updateUser(String username, UpdateUserDto updateUserDto);
    void deleteUser(String username);
    UserDto getUserByUsername(String username);
    List<UserDto> getAllUsers();
    UserDto addRoleToUser(UserRoleDto userRoleDto);
    UserDto removeRoleFromUser(UserRoleDto userRoleDto);
}
