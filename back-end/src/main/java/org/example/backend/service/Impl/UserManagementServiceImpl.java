package org.example.backend.service.Impl;

import org.example.backend.dao.entity.Role;
import org.example.backend.dao.entity.User;
import org.example.backend.dao.repository.RoleRepository;
import org.example.backend.dao.repository.UserRepository;
import org.example.backend.dto.CreateUserDto;
import org.example.backend.dto.UpdateUserDto;
import org.example.backend.dto.UserDto;
import org.example.backend.dto.UserRoleDto;
import org.example.backend.dto.ChangePasswordDto;
import org.example.backend.dto.ProfileUpdateDto;
import org.example.backend.mapper.UserMapper;
import org.example.backend.service.UserManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserManagementServiceImpl implements UserManagementService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public UserDto createUser(CreateUserDto createUserDto) {
        if (userRepository.existsById(createUserDto.getUsername())) {
            throw new RuntimeException("User already exists with username: " + createUserDto.getUsername());
        }

        User user = userMapper.toEntity(createUserDto);
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        
        // Add default role
        Optional<Role> defaultRole = roleRepository.findById("ORDINARY");
        if (defaultRole.isPresent()) {
            user.setRoles(new ArrayList<>());
            user.getRoles().add(defaultRole.get());
        }
        
        User savedUser = userRepository.save(user);
        return userMapper.toDto(savedUser);
    }

    @Override
    public UserDto updateUser(String username, UpdateUserDto updateUserDto) {
        User user = userRepository.findById(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        userMapper.updateEntity(user, updateUserDto);
        User updatedUser = userRepository.save(user);
        return userMapper.toDto(updatedUser);
    }

    @Override
    public void deleteUser(String username) {
        if (!userRepository.existsById(username)) {
            throw new RuntimeException("User not found with username: " + username);
        }
        userRepository.deleteById(username);
    }

    @Override
    public UserDto getUserByUsername(String username) {
        User user = userRepository.findById(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        return userMapper.toDto(user);
    }

    @Override
    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return userMapper.toDtoList(users);
    }

    @Override
    public UserDto addRoleToUser(UserRoleDto userRoleDto) {
        User user = userRepository.findById(userRoleDto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found with username: " + userRoleDto.getUsername()));

        Role role = roleRepository.findById(userRoleDto.getRole())
                .orElseThrow(() -> new RuntimeException("Role not found: " + userRoleDto.getRole()));

        if (user.getRoles() == null) {
            user.setRoles(new ArrayList<>());
        }

        if (!user.getRoles().contains(role)) {
            user.getRoles().add(role);
            User updatedUser = userRepository.save(user);
            return userMapper.toDto(updatedUser);
        }

        return userMapper.toDto(user);
    }

    @Override
    public UserDto removeRoleFromUser(UserRoleDto userRoleDto) {
        User user = userRepository.findById(userRoleDto.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found with username: " + userRoleDto.getUsername()));

        Role role = roleRepository.findById(userRoleDto.getRole())
                .orElseThrow(() -> new RuntimeException("Role not found: " + userRoleDto.getRole()));

        if (user.getRoles() != null && user.getRoles().contains(role)) {
            user.getRoles().remove(role);
            User updatedUser = userRepository.save(user);
            return userMapper.toDto(updatedUser);
        }

        return userMapper.toDto(user);
    }

    @Override
    public UserDto updateProfile(String username, ProfileUpdateDto profileUpdateDto) {
        User user = userRepository.findById(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        // Update profile fields
        if (profileUpdateDto.getEmail() != null) {
            user.setEmail(profileUpdateDto.getEmail());
        }
        if (profileUpdateDto.getFirstName() != null) {
            user.setFirstName(profileUpdateDto.getFirstName());
        }
        if (profileUpdateDto.getLastName() != null) {
            user.setLastName(profileUpdateDto.getLastName());
        }

        User updatedUser = userRepository.save(user);
        return userMapper.toDto(updatedUser);
    }

    @Override
    public void changePassword(String username, ChangePasswordDto changePasswordDto) {
        User user = userRepository.findById(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        // Verify current password
        if (!bCryptPasswordEncoder.matches(changePasswordDto.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Update password
        user.setPassword(bCryptPasswordEncoder.encode(changePasswordDto.getNewPassword()));
        userRepository.save(user);
    }
}
