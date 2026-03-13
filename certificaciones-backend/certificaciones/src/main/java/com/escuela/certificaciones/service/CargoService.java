package com.escuela.certificaciones.service;

import com.escuela.certificaciones.dto.CargoDTO;
import com.escuela.certificaciones.entity.Cargo;
import com.escuela.certificaciones.exception.ResourceNotFoundException;
import com.escuela.certificaciones.repository.CargoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CargoService {

    private final CargoRepository cargoRepository;

    @Transactional(readOnly = true)
    public List<CargoDTO> findAll() {
        return cargoRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CargoDTO findById(Long id) {
        return toDTO(cargoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cargo", id)));
    }

    public CargoDTO create(CargoDTO dto) {
        Cargo cargo = new Cargo();
        cargo.setNombre(dto.getNombre());
        cargo.setRequiereCurso(dto.getRequiereCurso() != null ? dto.getRequiereCurso() : false);
        return toDTO(cargoRepository.save(cargo));
    }

    public CargoDTO update(Long id, CargoDTO dto) {
        Cargo cargo = cargoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cargo", id));
        cargo.setNombre(dto.getNombre());
        cargo.setRequiereCurso(dto.getRequiereCurso() != null ? dto.getRequiereCurso() : false);
        return toDTO(cargoRepository.save(cargo));
    }

    public void delete(Long id) {
        if (!cargoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cargo", id);
        }
        cargoRepository.deleteById(id);
    }

    private CargoDTO toDTO(Cargo cargo) {
        CargoDTO dto = new CargoDTO();
        dto.setId(cargo.getId());
        dto.setNombre(cargo.getNombre());
        dto.setRequiereCurso(cargo.getRequiereCurso());
        return dto;
    }
}