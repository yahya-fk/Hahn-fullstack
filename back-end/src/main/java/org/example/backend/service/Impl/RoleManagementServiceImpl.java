package org.example.backend.service.Impl;

import org.example.backend.dao.entity.Role;
import org.example.backend.dao.repository.RoleRepository;
import org.example.backend.dto.RoleDto;
import org.example.backend.mapper.RoleMapper;
import org.example.backend.service.RoleManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class RoleManagementServiceImpl implements RoleManagementService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private RoleMapper roleMapper;

    @Override
    public RoleDto createRole(RoleDto roleDto) {
        if (roleRepository.existsById(roleDto.getRole())) {
            throw new RuntimeException("Role already exists: " + roleDto.getRole());
        }

        Role role = roleMapper.toEntity(roleDto);
        Role savedRole = roleRepository.save(role);
        return roleMapper.toDto(savedRole);
    }

    @Override
    public void deleteRole(String roleName) {
        if (!roleRepository.existsById(roleName)) {
            throw new RuntimeException("Role not found: " + roleName);
        }
        roleRepository.deleteById(roleName);
    }

    @Override
    public RoleDto getRoleByName(String roleName) {
        Role role = roleRepository.findById(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
        return roleMapper.toDto(role);
    }

    @Override
    public List<RoleDto> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        return roleMapper.toDtoList(roles);
    }
}
