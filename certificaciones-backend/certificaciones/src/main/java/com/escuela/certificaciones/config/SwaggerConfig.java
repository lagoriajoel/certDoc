package com.escuela.certificaciones.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Sistema de Certificaciones de Servicios Docentes")
                        .description("API REST para la gestión y emisión de certificaciones de servicios docentes")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Escuela")
                                .email("admin@escuela.edu.ar")));
    }
}
