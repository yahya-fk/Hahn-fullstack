package org.example.backend.service.Impl;

import org.example.backend.dao.entity.User;
import org.example.backend.dao.repository.UserRepository;
import org.example.backend.dto.ChangePasswordDto;
import org.example.backend.dto.ProfileUpdateDto;
import org.example.backend.dto.UserDto;
import org.example.backend.mapper.UserMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class UserManagementServiceImplProfileTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @InjectMocks
    private UserManagementServiceImpl userManagementService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void updateProfile_Success() {
        // Given
        String username = "testuser";
        ProfileUpdateDto profileUpdateDto = ProfileUpdateDto.builder()
                .email("newemail@example.com")
                .firstName("NewFirst")
                .lastName("NewLast")
                .build();

        User existingUser = User.builder()
                .username(username)
                .email("old@example.com")
                .firstName("OldFirst")
                .lastName("OldLast")
                .password("hashedPassword")
                .build();

        User updatedUser = User.builder()
                .username(username)
                .email("newemail@example.com")
                .firstName("NewFirst")
                .lastName("NewLast")
                .password("hashedPassword")
                .build();

        UserDto expectedUserDto = UserDto.builder()
                .username(username)
                .email("newemail@example.com")
                .firstName("NewFirst")
                .lastName("NewLast")
                .build();

        when(userRepository.findById(username)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenReturn(updatedUser);
        when(userMapper.toDto(updatedUser)).thenReturn(expectedUserDto);

        // When
        UserDto result = userManagementService.updateProfile(username, profileUpdateDto);

        // Then
        assertNotNull(result);
        assertEquals(expectedUserDto.getUsername(), result.getUsername());
        assertEquals(expectedUserDto.getEmail(), result.getEmail());
        assertEquals(expectedUserDto.getFirstName(), result.getFirstName());
        assertEquals(expectedUserDto.getLastName(), result.getLastName());

        verify(userRepository).findById(username);
        verify(userRepository).save(any(User.class));
        verify(userMapper).toDto(updatedUser);
    }

    @Test
    void updateProfile_UserNotFound() {
        // Given
        String username = "nonexistent";
        ProfileUpdateDto profileUpdateDto = ProfileUpdateDto.builder()
                .email("newemail@example.com")
                .build();

        when(userRepository.findById(username)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userManagementService.updateProfile(username, profileUpdateDto);
        });

        assertEquals("User not found with username: " + username, exception.getMessage());
        verify(userRepository).findById(username);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void updateProfile_PartialUpdate() {
        // Given
        String username = "testuser";
        ProfileUpdateDto profileUpdateDto = ProfileUpdateDto.builder()
                .email("newemail@example.com")
                // firstName and lastName are null, should not be updated
                .build();

        User existingUser = User.builder()
                .username(username)
                .email("old@example.com")
                .firstName("ExistingFirst")
                .lastName("ExistingLast")
                .password("hashedPassword")
                .build();

        when(userRepository.findById(username)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenReturn(existingUser);
        when(userMapper.toDto(any(User.class))).thenReturn(new UserDto());

        // When
        userManagementService.updateProfile(username, profileUpdateDto);

        // Then
        verify(userRepository).findById(username);
        verify(userRepository).save(argThat(user -> 
            user.getEmail().equals("newemail@example.com") &&
            user.getFirstName().equals("ExistingFirst") &&
            user.getLastName().equals("ExistingLast")
        ));
    }

    @Test
    void changePassword_Success() {
        // Given
        String username = "testuser";
        String currentPassword = "oldPassword";
        String newPassword = "newPassword";
        String hashedOldPassword = "hashedOldPassword";
        String hashedNewPassword = "hashedNewPassword";

        ChangePasswordDto changePasswordDto = ChangePasswordDto.builder()
                .currentPassword(currentPassword)
                .newPassword(newPassword)
                .build();

        User existingUser = User.builder()
                .username(username)
                .password(hashedOldPassword)
                .build();

        when(userRepository.findById(username)).thenReturn(Optional.of(existingUser));
        when(bCryptPasswordEncoder.matches(currentPassword, hashedOldPassword)).thenReturn(true);
        when(bCryptPasswordEncoder.encode(newPassword)).thenReturn(hashedNewPassword);
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        // When
        userManagementService.changePassword(username, changePasswordDto);

        // Then
        verify(userRepository).findById(username);
        verify(bCryptPasswordEncoder).matches(currentPassword, hashedOldPassword);
        verify(bCryptPasswordEncoder).encode(newPassword);
        verify(userRepository).save(argThat(user -> user.getPassword().equals(hashedNewPassword)));
    }

    @Test
    void changePassword_UserNotFound() {
        // Given
        String username = "nonexistent";
        ChangePasswordDto changePasswordDto = ChangePasswordDto.builder()
                .currentPassword("oldPassword")
                .newPassword("newPassword")
                .build();

        when(userRepository.findById(username)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userManagementService.changePassword(username, changePasswordDto);
        });

        assertEquals("User not found with username: " + username, exception.getMessage());
        verify(userRepository).findById(username);
        verify(bCryptPasswordEncoder, never()).matches(anyString(), anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void changePassword_IncorrectCurrentPassword() {
        // Given
        String username = "testuser";
        String currentPassword = "wrongPassword";
        String newPassword = "newPassword";
        String hashedPassword = "hashedPassword";

        ChangePasswordDto changePasswordDto = ChangePasswordDto.builder()
                .currentPassword(currentPassword)
                .newPassword(newPassword)
                .build();

        User existingUser = User.builder()
                .username(username)
                .password(hashedPassword)
                .build();

        when(userRepository.findById(username)).thenReturn(Optional.of(existingUser));
        when(bCryptPasswordEncoder.matches(currentPassword, hashedPassword)).thenReturn(false);

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userManagementService.changePassword(username, changePasswordDto);
        });

        assertEquals("Current password is incorrect", exception.getMessage());
        verify(userRepository).findById(username);
        verify(bCryptPasswordEncoder).matches(currentPassword, hashedPassword);
        verify(bCryptPasswordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }
}
