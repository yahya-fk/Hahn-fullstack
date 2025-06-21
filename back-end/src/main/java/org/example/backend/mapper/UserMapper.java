package org.example.backend.mapper;

import org.example.backend.dao.entity.User;
import org.example.backend.dto.CreateUserDto;
import org.example.backend.dto.UpdateUserDto;
import org.example.backend.dto.UserDto;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    private final ModelMapper modelMapper = new ModelMapper();

    @Autowired
    private RoleMapper roleMapper;

    public UserDto toDto(User user) {
        if (user == null) {
            return null;
        }
        UserDto userDto = modelMapper.map(user, UserDto.class);
        userDto.setRoles(roleMapper.toDtoList(user.getRoles()));
        return userDto;
    }

    public User toEntity(CreateUserDto createUserDto) {
        if (createUserDto == null) {
            return null;
        }
        return modelMapper.map(createUserDto, User.class);
    }

    public void updateEntity(User user, UpdateUserDto updateUserDto) {
        if (user == null || updateUserDto == null) {
            return;
        }
        modelMapper.map(updateUserDto, user);
    }

    public List<UserDto> toDtoList(List<User> users) {
        if (users == null) {
            return null;
        }
        return users.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
