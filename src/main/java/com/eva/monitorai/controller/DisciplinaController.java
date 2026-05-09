package com.eva.monitorai.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.eva.monitorai.dto.DisciplinaDTO;
import com.eva.monitorai.model.entity.Usuario;
import com.eva.monitorai.service.DisciplinaService;

@RestController
@RequestMapping("/disciplinas")
@CrossOrigin("*")
public class DisciplinaController {

    private final DisciplinaService service;

    public DisciplinaController(DisciplinaService service) {
        this.service = service;
    }

    // =====================================
    // LISTAR TODOS
    // =====================================

    @GetMapping
    public List<DisciplinaDTO> listarTodos() {

        return service.listarTodos();
    }

    // =====================================
    // BUSCAR POR ID
    // =====================================

    @GetMapping("/{id}")
    public DisciplinaDTO buscarPorId(
            @PathVariable Long id
    ) {

        return service.buscarPorId(id);
    }

    // =====================================
    // CRIAR
    // =====================================

    @PostMapping
    public DisciplinaDTO criar(
            @RequestBody DisciplinaDTO dto
    ) {

        return service.criar(dto);
    }

    // =====================================
    // ATUALIZAR
    // =====================================

    @PutMapping("/{id}")
    public DisciplinaDTO atualizar(
            @PathVariable Long id,
            @RequestBody DisciplinaDTO dto
    ) {

        return service.atualizar(id, dto);
    }

    // =====================================
    // DELETAR
    // =====================================

    @DeleteMapping("/{id}")
    public void deletar(
            @PathVariable Long id
    ) {

        service.deletar(id);
    }
    
    @GetMapping("/monitores")
    public ResponseEntity<List<Usuario>> listarMonitores() {
        List<Usuario> monitores = service.listarMonitores();
        return ResponseEntity.ok(monitores);
    }
}