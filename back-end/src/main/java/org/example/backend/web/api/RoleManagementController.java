package org.example.backend.web.api;

import org.example.backend.dto.RoleDto;
import org.example.backend.service.RoleManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin
public class RoleManagementController {

    @Autowired
    private RoleManagementService roleManagementService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoleDto> createRole(@RequestBody RoleDto roleDto) {
        try {
            RoleDto createdRole = roleManagementService.createRole(roleDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRole);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RoleDto>> getAllRoles() {
        List<RoleDto> roles = roleManagementService.getAllRoles();
        return ResponseEntity.ok(roles);
    }

    @GetMapping("/{roleName}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RoleDto> getRoleByName(@PathVariable String roleName) {
        try {
            RoleDto role = roleManagementService.getRoleByName(roleName);
            return ResponseEntity.ok(role);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{roleName}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRole(@PathVariable String roleName) {
        try {
            roleManagementService.deleteRole(roleName);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
