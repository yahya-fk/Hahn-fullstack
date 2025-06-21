package org.example.backend.service;

import org.example.backend.dto.RoleDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RoleManagementService {
    RoleDto createRole(RoleDto roleDto);
    void deleteRole(String roleName);
    RoleDto getRoleByName(String roleName);
    List<RoleDto> getAllRoles();
}
