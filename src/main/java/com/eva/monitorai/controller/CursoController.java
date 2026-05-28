package com.eva.monitorai.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.eva.monitorai.dto.CursoDTO;
import com.eva.monitorai.dto.DisciplinaDTO;
import com.eva.monitorai.service.CursoService;

/**
 * Controller responsável por expor os endpoints REST para gerenciamento de Cursos.
 */
@RestController
@RequestMapping("/cursos")
@CrossOrigin(origins = "*") // Permite que o seu React (ou qualquer origem) consulte esta API sem erros de CORS
public class CursoController {

    private final CursoService service;

    public CursoController(CursoService service) {
        this.service = service;
    }

    /**
     * Cria um novo curso no sistema.
     * Retorna o status HTTP 201 (Created) junto com o cabeçalho 'Location'.
     */
    @PostMapping
    public ResponseEntity<CursoDTO> criar(@RequestBody CursoDTO dto) {
        CursoDTO cursoCriado = service.criar(dto);
        
        // Cria a URI do novo recurso criado (Boa prática do padrão RESTful)
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(cursoCriado.getId())
                .toUri();
                
        return ResponseEntity.created(uri).body(cursoCriado);
    }

    /**
     * Retorna a lista de todos os cursos cadastrados.
     */
    @GetMapping
    public ResponseEntity<List<CursoDTO>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    /**
     * Busca um curso específico utilizando o ID informado na URL.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CursoDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    /**
     * Atualiza as informações de um curso existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<CursoDTO> atualizar(@PathVariable Long id, @RequestBody CursoDTO dto) {
        CursoDTO atualizado = service.atualizar(id, dto);
        return ResponseEntity.ok(atualizado);
    }

    /**
     * Remove um curso do sistema com base no ID.
     * Retorna HTTP 204 (No Content).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Filtra a listagem de cursos por parte do nome (Ignore Case).
     * Exemplo: /cursos/filtro?nome=analise
     */
    @GetMapping("/filtro")
    public ResponseEntity<List<CursoDTO>> filtrarPorNome(@RequestParam String nome) {
        return ResponseEntity.ok(service.filtrarPorNome(nome));
    }

    /**
     * Retorna todas as disciplinas vinculadas a um curso específico.
     * Exemplo: /cursos/1/disciplinas
     */
    @GetMapping("/{id}/disciplinas")
    public ResponseEntity<List<DisciplinaDTO>> listarDisciplinas(@PathVariable Long id) {
        return ResponseEntity.ok(service.listarDisciplinasDoCurso(id));
    }
    
    @PostMapping("/{cursoId}/disciplinas/{disciplinaId}")
    public ResponseEntity<Void> adicionarDisciplina(
            @PathVariable Long cursoId,
            @PathVariable Long disciplinaId) {
        service.adicionarDisciplina(cursoId, disciplinaId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{cursoId}/disciplinas/{disciplinaId}")
    public ResponseEntity<Void> removerDisciplina(
            @PathVariable Long cursoId,
            @PathVariable Long disciplinaId) {
        service.removerDisciplina(cursoId, disciplinaId);
        return ResponseEntity.ok().build();
    }
}