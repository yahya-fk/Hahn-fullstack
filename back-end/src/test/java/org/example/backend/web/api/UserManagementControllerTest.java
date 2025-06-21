package org.example.backend.web.api;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.example.backend.dto.CreateUserDto;
import org.example.backend.dto.RoleDto;
import org.example.backend.dto.UpdateUserDto;
import org.example.backend.dto.UserDto;
import org.example.backend.dto.UserRoleDto;
import org.example.backend.service.UserManagementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserManagementController Tests")
class UserManagementControllerTest {

    @Mock
    private UserManagementService userManagementService;

    @InjectMocks
    private UserManagementController userManagementController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;
    private UserDto testUserDto;
    private CreateUserDto testCreateUserDto;
    private UpdateUserDto testUpdateUserDto;
    private UserRoleDto testUserRoleDto;
    private RoleDto testRoleDto;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(userManagementController).build();
        objectMapper = new ObjectMapper();

        // Setup test data
        testRoleDto = RoleDto.builder()
                .role("USER")
                .build();

        testUserDto = UserDto.builder()
                .username("testuser")
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .roles(Collections.singletonList(testRoleDto))
                .build();

        testCreateUserDto = CreateUserDto.builder()
                .username("testuser")
                .password("password123")
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .build();

        testUpdateUserDto = UpdateUserDto.builder()
                .email("updated@example.com")
                .firstName("Updated")
                .lastName("User")
                .build();

        testUserRoleDto = UserRoleDto.builder()
                .username("testuser")
                .role("ADMIN")
                .build();
    }

    @Test
    @DisplayName("Should create user successfully when valid data provided")
    @WithMockUser(roles = "ADMIN")
    void createUser_ValidData_ShouldReturnCreatedUser() throws Exception {
        // Given
        when(userManagementService.createUser(any(CreateUserDto.class))).thenReturn(testUserDto);

        // When & Then
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateUserDto)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.firstName").value("Test"))
                .andExpect(jsonPath("$.lastName").value("User"));

        verify(userManagementService, times(1)).createUser(any(CreateUserDto.class));
    }

    @Test
    @DisplayName("Should return bad request when create user throws exception")
    @WithMockUser(roles = "ADMIN")
    void createUser_ServiceThrowsException_ShouldReturnBadRequest() throws Exception {
        // Given
        when(userManagementService.createUser(any(CreateUserDto.class)))
                .thenThrow(new RuntimeException("User already exists"));

        // When & Then
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testCreateUserDto)))
                .andExpect(status().isBadRequest());

        verify(userManagementService, times(1)).createUser(any(CreateUserDto.class));
    }

    @Test
    @DisplayName("Should get all users successfully")
    @WithMockUser(roles = "ADMIN")
    void getAllUsers_ShouldReturnUserList() throws Exception {
        // Given
        List<UserDto> users = Arrays.asList(testUserDto);
        when(userManagementService.getAllUsers()).thenReturn(users);

        // When & Then
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].username").value("testuser"))
                .andExpect(jsonPath("$[0].email").value("test@example.com"));

        verify(userManagementService, times(1)).getAllUsers();
    }

    @Test
    @DisplayName("Should get user by username successfully")
    @WithMockUser(roles = "ADMIN")
    void getUserByUsername_ValidUsername_ShouldReturnUser() throws Exception {
        // Given
        when(userManagementService.getUserByUsername("testuser")).thenReturn(testUserDto);

        // When & Then
        mockMvc.perform(get("/api/users/testuser"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));

        verify(userManagementService, times(1)).getUserByUsername("testuser");
    }

    @Test
    @DisplayName("Should return not found when user doesn't exist")
    @WithMockUser(roles = "ADMIN")
    void getUserByUsername_UserNotFound_ShouldReturnNotFound() throws Exception {
        // Given
        when(userManagementService.getUserByUsername("nonexistent"))
                .thenThrow(new RuntimeException("User not found"));

        // When & Then
        mockMvc.perform(get("/api/users/nonexistent"))
                .andExpect(status().isNotFound());

        verify(userManagementService, times(1)).getUserByUsername("nonexistent");
    }

    @Test
    @DisplayName("Should update user successfully")
    @WithMockUser(roles = "ADMIN")
    void updateUser_ValidData_ShouldReturnUpdatedUser() throws Exception {
        // Given
        UserDto updatedUser = UserDto.builder()
                .username("testuser")
                .email("updated@example.com")
                .firstName("Updated")
                .lastName("User")
                .roles(Collections.singletonList(testRoleDto))
                .build();

        when(userManagementService.updateUser(eq("testuser"), any(UpdateUserDto.class)))
                .thenReturn(updatedUser);

        // When & Then
        mockMvc.perform(put("/api/users/testuser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testUpdateUserDto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.email").value("updated@example.com"))
                .andExpect(jsonPath("$.firstName").value("Updated"));

        verify(userManagementService, times(1)).updateUser(eq("testuser"), any(UpdateUserDto.class));
    }

    @Test
    @DisplayName("Should return not found when updating non-existent user")
    @WithMockUser(roles = "ADMIN")
    void updateUser_UserNotFound_ShouldReturnNotFound() throws Exception {
        // Given
        when(userManagementService.updateUser(eq("nonexistent"), any(UpdateUserDto.class)))
                .thenThrow(new RuntimeException("User not found"));

        // When & Then
        mockMvc.perform(put("/api/users/nonexistent")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testUpdateUserDto)))
                .andExpect(status().isNotFound());

        verify(userManagementService, times(1)).updateUser(eq("nonexistent"), any(UpdateUserDto.class));
    }

    @Test
    @DisplayName("Should delete user successfully")
    @WithMockUser(roles = "ADMIN")
    void deleteUser_ValidUsername_ShouldReturnNoContent() throws Exception {
        // Given
        doNothing().when(userManagementService).deleteUser("testuser");

        // When & Then
        mockMvc.perform(delete("/api/users/testuser"))
                .andExpect(status().isNoContent());

        verify(userManagementService, times(1)).deleteUser("testuser");
    }

    @Test
    @DisplayName("Should return not found when deleting non-existent user")
    @WithMockUser(roles = "ADMIN")
    void deleteUser_UserNotFound_ShouldReturnNotFound() throws Exception {
        // Given
        doThrow(new RuntimeException("User not found"))
                .when(userManagementService).deleteUser("nonexistent");

        // When & Then
        mockMvc.perform(delete("/api/users/nonexistent"))
                .andExpect(status().isNotFound());

        verify(userManagementService, times(1)).deleteUser("nonexistent");
    }

    @Test
    @DisplayName("Should add role to user successfully")
    @WithMockUser(roles = "ADMIN")
    void addRoleToUser_ValidData_ShouldReturnUpdatedUser() throws Exception {
        // Given
        RoleDto adminRole = RoleDto.builder().role("ADMIN").build();
        UserDto userWithNewRole = UserDto.builder()
                .username("testuser")
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .roles(Arrays.asList(testRoleDto, adminRole))
                .build();

        when(userManagementService.addRoleToUser(any(UserRoleDto.class)))
                .thenReturn(userWithNewRole);

        // When & Then
        mockMvc.perform(post("/api/users/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testUserRoleDto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.roles").isArray())
                .andExpect(jsonPath("$.roles.length()").value(2));

        verify(userManagementService, times(1)).addRoleToUser(any(UserRoleDto.class));
    }

    @Test
    @DisplayName("Should return bad request when adding role fails")
    @WithMockUser(roles = "ADMIN")
    void addRoleToUser_ServiceThrowsException_ShouldReturnBadRequest() throws Exception {
        // Given
        when(userManagementService.addRoleToUser(any(UserRoleDto.class)))
                .thenThrow(new RuntimeException("Role assignment failed"));

        // When & Then
        mockMvc.perform(post("/api/users/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testUserRoleDto)))
                .andExpect(status().isBadRequest());

        verify(userManagementService, times(1)).addRoleToUser(any(UserRoleDto.class));
    }

    @Test
    @DisplayName("Should remove role from user successfully")
    @WithMockUser(roles = "ADMIN")
    void removeRoleFromUser_ValidData_ShouldReturnUpdatedUser() throws Exception {
        // Given
        UserDto userWithRemovedRole = UserDto.builder()
                .username("testuser")
                .email("test@example.com")
                .firstName("Test")
                .lastName("User")
                .roles(Collections.emptyList())
                .build();

        when(userManagementService.removeRoleFromUser(any(UserRoleDto.class)))
                .thenReturn(userWithRemovedRole);

        // When & Then
        mockMvc.perform(delete("/api/users/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testUserRoleDto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.roles").isArray())
                .andExpect(jsonPath("$.roles.length()").value(0));

        verify(userManagementService, times(1)).removeRoleFromUser(any(UserRoleDto.class));
    }

    @Test
    @DisplayName("Should return bad request when removing role fails")
    @WithMockUser(roles = "ADMIN")
    void removeRoleFromUser_ServiceThrowsException_ShouldReturnBadRequest() throws Exception {
        // Given
        when(userManagementService.removeRoleFromUser(any(UserRoleDto.class)))
                .thenThrow(new RuntimeException("Role removal failed"));

        // When & Then
        mockMvc.perform(delete("/api/users/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testUserRoleDto)))
                .andExpect(status().isBadRequest());

        verify(userManagementService, times(1)).removeRoleFromUser(any(UserRoleDto.class));
    }

    @Test
    @DisplayName("Should allow user to access their own profile")
    @WithMockUser(username = "testuser", roles = "USER")
    void getUserByUsername_UserAccessingOwnProfile_ShouldReturnUser() throws Exception {
        // Given
        when(userManagementService.getUserByUsername("testuser")).thenReturn(testUserDto);

        // When & Then
        mockMvc.perform(get("/api/users/testuser"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.username").value("testuser"));

        verify(userManagementService, times(1)).getUserByUsername("testuser");
    }

    @Test
    @DisplayName("Should allow user to update their own profile")
    @WithMockUser(username = "testuser", roles = "USER")
    void updateUser_UserUpdatingOwnProfile_ShouldReturnUpdatedUser() throws Exception {
        // Given
        UserDto updatedUser = UserDto.builder()
                .username("testuser")
                .email("updated@example.com")
                .firstName("Updated")
                .lastName("User")
                .roles(Collections.singletonList(testRoleDto))
                .build();

        when(userManagementService.updateUser(eq("testuser"), any(UpdateUserDto.class)))
                .thenReturn(updatedUser);

        // When & Then
        mockMvc.perform(put("/api/users/testuser")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testUpdateUserDto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.email").value("updated@example.com"));

        verify(userManagementService, times(1)).updateUser(eq("testuser"), any(UpdateUserDto.class));
    }
}
