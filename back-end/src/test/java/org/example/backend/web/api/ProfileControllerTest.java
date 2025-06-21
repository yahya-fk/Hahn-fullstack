package org.example.backend.web.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.backend.dto.ChangePasswordDto;
import org.example.backend.dto.ProfileUpdateDto;
import org.example.backend.dto.UserDto;
import org.example.backend.service.UserManagementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ProfileControllerTest {

    @Mock
    private UserManagementService userManagementService;

    @Mock
    private Authentication authentication;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private ProfileController profileController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(profileController).build();
        objectMapper = new ObjectMapper();
        
        // Setup security context
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn("testuser");
    }

    @Test
    void getCurrentUserProfile_Success() throws Exception {
        // Given
        UserDto userDto = UserDto.builder()
                .username("testuser")
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .build();

        when(userManagementService.getUserByUsername("testuser")).thenReturn(userDto);

        // When & Then
        mockMvc.perform(get("/api/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.firstName").value("Test"))
                .andExpect(jsonPath("$.lastName").value("User"));

        verify(userManagementService).getUserByUsername("testuser");
    }

    @Test
    void getCurrentUserProfile_UserNotFound() throws Exception {
        // Given
        when(userManagementService.getUserByUsername("testuser"))
                .thenThrow(new RuntimeException("User not found"));

        // When & Then
        mockMvc.perform(get("/api/profile"))
                .andExpect(status().isNotFound());

        verify(userManagementService).getUserByUsername("testuser");
    }

    @Test
    void updateProfile_Success() throws Exception {
        // Given
        ProfileUpdateDto profileUpdateDto = ProfileUpdateDto.builder()
                .email("newemail@example.com")
                .firstName("NewFirst")
                .lastName("NewLast")
                .build();

        UserDto updatedUserDto = UserDto.builder()
                .username("testuser")
                .email("newemail@example.com")
                .firstName("NewFirst")
                .lastName("NewLast")
                .build();

        when(userManagementService.updateProfile(eq("testuser"), any(ProfileUpdateDto.class)))
                .thenReturn(updatedUserDto);

        // When & Then
        mockMvc.perform(put("/api/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(profileUpdateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("newemail@example.com"))
                .andExpect(jsonPath("$.firstName").value("NewFirst"))
                .andExpect(jsonPath("$.lastName").value("NewLast"));

        verify(userManagementService).updateProfile(eq("testuser"), any(ProfileUpdateDto.class));
    }

    @Test
    void updateProfile_Failure() throws Exception {
        // Given
        ProfileUpdateDto profileUpdateDto = ProfileUpdateDto.builder()
                .email("invalid-email")
                .build();

        when(userManagementService.updateProfile(eq("testuser"), any(ProfileUpdateDto.class)))
                .thenThrow(new RuntimeException("Update failed"));

        // When & Then
        mockMvc.perform(put("/api/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(profileUpdateDto)))
                .andExpect(status().isBadRequest());

        verify(userManagementService).updateProfile(eq("testuser"), any(ProfileUpdateDto.class));
    }

    @Test
    void changePassword_Success() throws Exception {
        // Given
        ChangePasswordDto changePasswordDto = ChangePasswordDto.builder()
                .currentPassword("oldPassword")
                .newPassword("newPassword")
                .build();

        doNothing().when(userManagementService).changePassword(eq("testuser"), any(ChangePasswordDto.class));

        // When & Then
        mockMvc.perform(put("/api/profile/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(changePasswordDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Password changed successfully"));

        verify(userManagementService).changePassword(eq("testuser"), any(ChangePasswordDto.class));
    }

    @Test
    void changePassword_IncorrectCurrentPassword() throws Exception {
        // Given
        ChangePasswordDto changePasswordDto = ChangePasswordDto.builder()
                .currentPassword("wrongPassword")
                .newPassword("newPassword")
                .build();

        doThrow(new RuntimeException("Current password is incorrect"))
                .when(userManagementService).changePassword(eq("testuser"), any(ChangePasswordDto.class));

        // When & Then
        mockMvc.perform(put("/api/profile/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(changePasswordDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Current password is incorrect"));

        verify(userManagementService).changePassword(eq("testuser"), any(ChangePasswordDto.class));
    }

    @Test
    void changePassword_UserNotFound() throws Exception {
        // Given
        ChangePasswordDto changePasswordDto = ChangePasswordDto.builder()
                .currentPassword("oldPassword")
                .newPassword("newPassword")
                .build();

        doThrow(new RuntimeException("User not found"))
                .when(userManagementService).changePassword(eq("testuser"), any(ChangePasswordDto.class));

        // When & Then
        mockMvc.perform(put("/api/profile/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(changePasswordDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("User not found"));

        verify(userManagementService).changePassword(eq("testuser"), any(ChangePasswordDto.class));
    }
}
