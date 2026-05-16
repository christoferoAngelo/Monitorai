package com.eva.monitorai.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.eva.monitorai.dto.DisciplinaDTO;
import com.eva.monitorai.model.entity.Usuario;
import com.eva.monitorai.service.DisciplinaService;

/**
 * Controller REST responsável por expor os endpoints de gerenciamento de Disciplinas.
 * Fornece operações de CRUD e filtros de associação.
 */
@RestController
@RequestMapping("/disciplinas")
@CrossOrigin("*")
public class DisciplinaController {

    private final DisciplinaService service;

    public DisciplinaController(DisciplinaService service) {
        this.service = service;
    }

    // =========================================================================
    // OPERAÇÕES DO CRUD (ENDPOINT PRINCIPAIS)
    // =========================================================================

    /**
     * Recupera todas as disciplinas cadastradas no sistema.
     * Retorna: 200 OK com a lista de DTOs.
     */
    @GetMapping
    public ResponseEntity<List<DisciplinaDTO>> listarTodos() {
        List<DisciplinaDTO> disciplinas = service.listarTodos();
        return ResponseEntity.ok(disciplinas);
    }

    /**
     * Busca os detalhes de uma disciplina específica através do seu ID.
     * Retorna: 200 OK com o DTO encontrado.
     */
    @GetMapping("/{id}")
    public ResponseEntity<DisciplinaDTO> buscarPorId(@PathVariable Long id) {
        DisciplinaDTO dto = service.buscarPorId(id);
        return ResponseEntity.ok(dto);
    }

    /**
     * Registra uma nova disciplina associando-a a um ou mais cursos.
     * Retorna: 201 Created com o DTO da disciplina persistida.
     */
    @PostMapping
    public ResponseEntity<DisciplinaDTO> criar(@RequestBody DisciplinaDTO dto) {
        DisciplinaDTO novaDisciplina = service.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaDisciplina);
    }

    /**
     * Atualiza os dados de uma disciplina existente.
     * Retorna: 200 OK com o DTO atualizado.
     */
    @PutMapping("/{id}")
    public ResponseEntity<DisciplinaDTO> atualizar(
            @PathVariable Long id,
            @RequestBody DisciplinaDTO dto
    ) {
        DisciplinaDTO disciplinaAtualizada = service.atualizar(id, dto);
        return ResponseEntity.ok(disciplinaAtualizada);
    }

    /**
     * Exclui permanentemente uma disciplina com base no ID fornecido.
     * Retorna: 204 No Content para indicar sucesso sem corpo de resposta.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    // =========================================================================
    // CONSULTAS E FILTROS ESPECÍFICOS
    // =========================================================================

    /**
     * Lista todos os usuários cuja função (Role) corresponda a monitores disponíveis.
     * Retorna: 200 OK com a lista de usuários monitores.
     */
    @GetMapping("/monitores")
    public ResponseEntity<List<Usuario>> listarMonitores() {
        List<Usuario> monitores = service.listarMonitores();
        return ResponseEntity.ok(monitores);
    }

    /**
     * Recupera dinamicamente a listagem de disciplinas associadas a um curso específico.
     * Endpoint essencial para o colapso/visão de disciplinas no Front.
     * Retorna: 200 OK com a lista filtrada de DTOs.
     */
    @GetMapping("/curso/{cursoId}")
    public ResponseEntity<List<DisciplinaDTO>> listarPorCurso(@PathVariable Long cursoId) {
        List<DisciplinaDTO> disciplinasPorCurso = service.listarPorCurso(cursoId);
        return ResponseEntity.ok(disciplinasPorCurso);
    }
}