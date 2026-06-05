package com.eva.monitorai.controller;

import com.eva.monitorai.dto.EditalDTO;
import com.eva.monitorai.service.EditalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/editais")
public class EditalController {

    @Autowired
    private EditalService service;

    @GetMapping
    public ResponseEntity<List<EditalDTO>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EditalDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    // POST normal (recebe JSON com a URL do Cloudinary)
    @PostMapping
    public ResponseEntity<EditalDTO> criar(@RequestBody EditalDTO dto) {
        return ResponseEntity.ok(service.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EditalDTO> atualizar(@PathVariable Long id, @RequestBody EditalDTO dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        service.excluir(id);
        return ResponseEntity.ok().build();
    }
}