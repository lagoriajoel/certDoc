package com.escuela.certificaciones.config;

import com.escuela.certificaciones.entity.Usuario;
import com.escuela.certificaciones.entity.Usuario.Rol;
import com.escuela.certificaciones.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder   passwordEncoder;
    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.operador.password}")
    private String operadorPassword;
    @Override
    public void run(ApplicationArguments args) {
        crearOActualizar("admin",    adminPassword,    "Administrador", Rol.ADMIN);
        crearOActualizar("operador", operadorPassword, "Operador",      Rol.OPERADOR);
    }

    private void crearOActualizar(String username, String password, String nombre, Rol rol) {
        if (usuarioRepository.existsByUsername(username)) {
            Usuario u = usuarioRepository.findByUsername(username).get();
            u.setPassword(passwordEncoder.encode(password));
            usuarioRepository.save(u);
        } else {
            usuarioRepository.save(Usuario.builder()
                    .username(username)
                    .password(passwordEncoder.encode(password))
                    .nombre(nombre)
                    .rol(rol)
                    .activo(true)
                    .build());
        }
        log.info("✔ Usuario '{}' listo", username);
    }
}