package kr.gilmok.platform.global.dto;

public record AuthUserDto(
        Long id,
        String username,
        String passwordHash,
        String role,
        String status
) {
}
