package org.example.backend.mapper;

import org.example.backend.dao.entity.Role;
import org.example.backend.dto.RoleDto;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RoleMapper {

    private final ModelMapper modelMapper = new ModelMapper();

    public RoleDto toDto(Role role) {
        if (role == null) {
            return null;
        }
        return modelMapper.map(role, RoleDto.class);
    }

    public Role toEntity(RoleDto roleDto) {
        if (roleDto == null) {
            return null;
        }
        return modelMapper.map(roleDto, Role.class);
    }

    public List<RoleDto> toDtoList(List<Role> roles) {
        if (roles == null) {
            return null;
        }
        return roles.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<Role> toEntityList(List<RoleDto> roleDtos) {
        if (roleDtos == null) {
            return null;
        }
        return roleDtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
}
