package org.example.backend.web.api;

import java.util.Arrays;
import java.util.List;

import org.example.backend.dto.RoleDto;
import org.example.backend.service.RoleManagementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
@DisplayName("RoleManagementController Tests")
class RoleManagementControllerTest {

    @Mock
    private RoleManagementService roleManagementService;

    @InjectMocks
    private RoleManagementController roleManagementController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;
    private RoleDto testRoleDto;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(roleManagementController).build();
        objectMapper = new ObjectMapper();

        // Setup test data
        testRoleDto = RoleDto.builder()
                .role("TEST_ROLE")
                .build();
    }

    @Test
    @DisplayName("Should create role successfully when valid data provided")
    @WithMockUser(roles = "ADMIN")
    void createRole_ValidData_ShouldReturnCreatedRole() throws Exception {
        // Given
        when(roleManagementService.createRole(any(RoleDto.class))).thenReturn(testRoleDto);

        // When & Then
        mockMvc.perform(post("/api/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testRoleDto)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.role").value("TEST_ROLE"));

        verify(roleManagementService, times(1)).createRole(any(RoleDto.class));
    }

    @Test
    @DisplayName("Should return bad request when create role throws exception")
    @WithMockUser(roles = "ADMIN")
    void createRole_ServiceThrowsException_ShouldReturnBadRequest() throws Exception {
        // Given
        when(roleManagementService.createRole(any(RoleDto.class)))
                .thenThrow(new RuntimeException("Role already exists"));

        // When & Then
        mockMvc.perform(post("/api/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testRoleDto)))
                .andExpect(status().isBadRequest());

        verify(roleManagementService, times(1)).createRole(any(RoleDto.class));
    }

    @Test
    @DisplayName("Should get all roles successfully")
    @WithMockUser(roles = "ADMIN")
    void getAllRoles_ShouldReturnRoleList() throws Exception {
        // Given
        RoleDto adminRole = RoleDto.builder().role("ADMIN").build();
        RoleDto userRole = RoleDto.builder().role("USER").build();
        List<RoleDto> roles = Arrays.asList(adminRole, userRole, testRoleDto);
        
        when(roleManagementService.getAllRoles()).thenReturn(roles);

        // When & Then
        mockMvc.perform(get("/api/roles"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(3))
                .andExpect(jsonPath("$[0].role").value("ADMIN"))
                .andExpect(jsonPath("$[1].role").value("USER"))
                .andExpect(jsonPath("$[2].role").value("TEST_ROLE"));

        verify(roleManagementService, times(1)).getAllRoles();
    }

    @Test
    @DisplayName("Should get role by name successfully")
    @WithMockUser(roles = "ADMIN")
    void getRoleByName_ValidRoleName_ShouldReturnRole() throws Exception {
        // Given
        when(roleManagementService.getRoleByName("TEST_ROLE")).thenReturn(testRoleDto);

        // When & Then
        mockMvc.perform(get("/api/roles/TEST_ROLE"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.role").value("TEST_ROLE"));

        verify(roleManagementService, times(1)).getRoleByName("TEST_ROLE");
    }

    @Test
    @DisplayName("Should return not found when role doesn't exist")
    @WithMockUser(roles = "ADMIN")
    void getRoleByName_RoleNotFound_ShouldReturnNotFound() throws Exception {
        // Given
        when(roleManagementService.getRoleByName("NONEXISTENT_ROLE"))
                .thenThrow(new RuntimeException("Role not found"));

        // When & Then
        mockMvc.perform(get("/api/roles/NONEXISTENT_ROLE"))
                .andExpect(status().isNotFound());

        verify(roleManagementService, times(1)).getRoleByName("NONEXISTENT_ROLE");
    }

    @Test
    @DisplayName("Should delete role successfully")
    @WithMockUser(roles = "ADMIN")
    void deleteRole_ValidRoleName_ShouldReturnNoContent() throws Exception {
        // Given
        doNothing().when(roleManagementService).deleteRole("TEST_ROLE");

        // When & Then
        mockMvc.perform(delete("/api/roles/TEST_ROLE"))
                .andExpect(status().isNoContent());

        verify(roleManagementService, times(1)).deleteRole("TEST_ROLE");
    }

    @Test
    @DisplayName("Should return not found when deleting non-existent role")
    @WithMockUser(roles = "ADMIN")
    void deleteRole_RoleNotFound_ShouldReturnNotFound() throws Exception {
        // Given
        doThrow(new RuntimeException("Role not found"))
                .when(roleManagementService).deleteRole("NONEXISTENT_ROLE");

        // When & Then
        mockMvc.perform(delete("/api/roles/NONEXISTENT_ROLE"))
                .andExpect(status().isNotFound());

        verify(roleManagementService, times(1)).deleteRole("NONEXISTENT_ROLE");
    }

    @Test
    @DisplayName("Should handle empty role list")
    @WithMockUser(roles = "ADMIN")
    void getAllRoles_EmptyList_ShouldReturnEmptyArray() throws Exception {
        // Given
        when(roleManagementService.getAllRoles()).thenReturn(Arrays.asList());

        // When & Then
        mockMvc.perform(get("/api/roles"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));

        verify(roleManagementService, times(1)).getAllRoles();
    }

    @Test
    @DisplayName("Should handle role with special characters")
    @WithMockUser(roles = "ADMIN")
    void createRole_RoleWithSpecialCharacters_ShouldReturnCreatedRole() throws Exception {
        // Given
        RoleDto specialRole = RoleDto.builder().role("SPECIAL-ROLE_2023").build();
        when(roleManagementService.createRole(any(RoleDto.class))).thenReturn(specialRole);

        // When & Then
        mockMvc.perform(post("/api/roles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(specialRole)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.role").value("SPECIAL-ROLE_2023"));

        verify(roleManagementService, times(1)).createRole(any(RoleDto.class));
    }

    @Test
    @DisplayName("Should handle role name with spaces in URL")
    @WithMockUser(roles = "ADMIN")
    void getRoleByName_RoleNameWithSpaces_ShouldReturnRole() throws Exception {
        // Given
        RoleDto roleWithSpaces = RoleDto.builder().role("ROLE WITH SPACES").build();
        when(roleManagementService.getRoleByName("ROLE WITH SPACES")).thenReturn(roleWithSpaces);

        // When & Then
        mockMvc.perform(get("/api/roles/ROLE WITH SPACES"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.role").value("ROLE WITH SPACES"));

        verify(roleManagementService, times(1)).getRoleByName("ROLE WITH SPACES");
    }

    @Test
    @DisplayName("Should verify interaction with service layer exactly once per operation")
    @WithMockUser(roles = "ADMIN")
    void verifyServiceInteractions_ShouldCallServiceExactlyOnce() throws Exception {
        // Given
        when(roleManagementService.createRole(any(RoleDto.class))).thenReturn(testRoleDto);
        when(roleManagementService.getAllRoles()).thenReturn(Arrays.asList(testRoleDto));
        when(roleManagementService.getRoleByName("TEST_ROLE")).thenReturn(testRoleDto);
        doNothing().when(roleManagementService).deleteRole("TEST_ROLE");

        // When - perform multiple operations
        mockMvc.perform(post("/api/roles")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testRoleDto)));

        mockMvc.perform(get("/api/roles"));
        
        mockMvc.perform(get("/api/roles/TEST_ROLE"));
        
        mockMvc.perform(delete("/api/roles/TEST_ROLE"));

        // Then - verify each service method was called exactly once
        verify(roleManagementService, times(1)).createRole(any(RoleDto.class));
        verify(roleManagementService, times(1)).getAllRoles();
        verify(roleManagementService, times(1)).getRoleByName("TEST_ROLE");
        verify(roleManagementService, times(1)).deleteRole("TEST_ROLE");
        
        // Verify no other interactions occurred
        verifyNoMoreInteractions(roleManagementService);
    }
}
