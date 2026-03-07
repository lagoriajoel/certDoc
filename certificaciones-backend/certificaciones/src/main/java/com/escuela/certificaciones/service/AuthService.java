package com.escuela.certificaciones.service;

import com.escuela.certificaciones.dto.AuthDTOs.*;
import com.escuela.certificaciones.entity.Usuario;
import com.escuela.certificaciones.entity.Usuario.Rol;
import com.escuela.certificaciones.exception.BusinessException;
import com.escuela.certificaciones.repository.UsuarioRepository;
import com.escuela.certificaciones.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    // ── Login ──────────────────────────────────────────────────

    public LoginResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(), request.getPassword()));
        } catch (AuthenticationException e) {
            throw new BadCredentialsException("Usuario o contraseña incorrectos");
        }

        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Usuario no encontrado"));

        if (!usuario.isActivo()) {
            throw new BusinessException("El usuario está desactivado");
        }

        String token = jwtService.generateToken(usuario);

        return LoginResponse.builder()
                .token(token)
                .username(usuario.getUsername())
                .nombre(usuario.getNombre())
                .rol(usuario.getRol().name())
                .expiresIn(jwtService.getExpiration())
                .build();
    }

    // ── CRUD usuarios ──────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<UsuarioResponse> findAll() {
        return usuarioRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public UsuarioResponse crearUsuario(CrearUsuarioRequest request) {
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("Ya existe un usuario con ese nombre: " + request.getUsername());
        }
        Usuario usuario = Usuario.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .nombre(request.getNombre())
                .rol(Rol.valueOf(request.getRol().toUpperCase()))
                .activo(true)
                .build();
        return toResponse(usuarioRepository.save(usuario));
    }

    public void cambiarPassword(Long id, String nuevaPassword) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Usuario no encontrado"));
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.save(usuario);
    }

    public UsuarioResponse toggleActivo(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Usuario no encontrado"));
        usuario.setActivo(!usuario.isActivo());
        return toResponse(usuarioRepository.save(usuario));
    }

    public void eliminar(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new BusinessException("Usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
    }

    private UsuarioResponse toResponse(Usuario u) {
        return UsuarioResponse.builder()
                .id(u.getId())
                .username(u.getUsername())
                .nombre(u.getNombre())
                .rol(u.getRol().name())
                .activo(u.isActivo())
                .build();
    }
}
