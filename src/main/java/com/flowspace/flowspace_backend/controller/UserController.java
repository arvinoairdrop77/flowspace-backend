package com.flowspace.flowspace_backend.controller;

import com.flowspace.flowspace_backend.entity.Role;
import com.flowspace.flowspace_backend.entity.User;
import com.flowspace.flowspace_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    // 1. Ambil semua user (Hanya SUPERADMIN)
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_SUPERADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    // 2. Ubah Role User (Hanya SUPERADMIN)
    @PutMapping("/{userId}/role")
    @PreAuthorize("hasAuthority('ROLE_SUPERADMIN')")
    public ResponseEntity<?> updateUserRole(@PathVariable Long userId, @RequestBody Role newRole) {
        return userRepository.findById(userId).map(user -> {
            user.setRole(newRole);
            userRepository.save(user);
            return ResponseEntity.ok("Role berhasil diupdate");
        }).orElse(ResponseEntity.notFound().build());
    }

    // 3. Hapus User (Hanya SUPERADMIN)
    @DeleteMapping("/{userId}")
    @PreAuthorize("hasAuthority('ROLE_SUPERADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        if (!userRepository.existsById(userId)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(userId);
        return ResponseEntity.ok("User berhasil dihapus");
    }
}