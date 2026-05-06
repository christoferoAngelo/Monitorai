package com.eva.monitorai.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.eva.monitorai.dto.CursoDTO;
import com.eva.monitorai.service.CursoService;

// Controller responsável por expor as rotas de Curso
@RestController
@RequestMapping("/cursos")
public class CursoController {

    private final CursoService service;

    public CursoController(CursoService service) {
        this.service = service;
    }

    // Criar um novo curso
    @PostMapping
    public ResponseEntity<CursoDTO> criar(@RequestBody CursoDTO dto) {
        CursoDTO cursoCriado = service.criar(dto);
        return ResponseEntity.ok(cursoCriado);
    }

    // Listar todos os cursos
    @GetMapping
    public ResponseEntity<List<CursoDTO>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    // Buscar curso por ID
    @GetMapping("/{id}")
    public ResponseEntity<CursoDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    // Atualizar curso
    @PutMapping("/{id}")
    public ResponseEntity<CursoDTO> atualizar(
            @PathVariable Long id,
            @RequestBody CursoDTO dto) {

        CursoDTO atualizado = service.atualizar(id, dto);
        return ResponseEntity.ok(atualizado);
    }

    // Deletar curso
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
