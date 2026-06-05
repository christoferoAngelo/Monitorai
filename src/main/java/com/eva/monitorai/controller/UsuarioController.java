package com.eva.monitorai.controller;

import com.eva.monitorai.dto.MaterialDTO;
import com.eva.monitorai.dto.PerfilDTO;
import com.eva.monitorai.dto.UsuarioDTO;
import com.eva.monitorai.model.entity.Usuario;
import com.eva.monitorai.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;
    
    @Autowired
    private BCryptPasswordEncoder encoder;

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listarUsuarios() {
        List<Usuario> usuarios = repository.findAll();
        
        List<UsuarioDTO> usuariosDTO = usuarios.stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(usuariosDTO);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> promover(@PathVariable Long id, @RequestBody UsuarioDTO dto) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        String novaRole = dto.getRole();
        usuario.setRole(novaRole);
        
        repository.save(usuario);
        return ResponseEntity.ok(converterParaDTO(usuario));
    }

    private UsuarioDTO converterParaDTO(Usuario usuario) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setUsername(usuario.getUsername());
        dto.setEmail(usuario.getEmail());
        dto.setRole(usuario.getRole());
        dto.setRa(usuario.getRa());
        dto.setAtivo(usuario.getAtivo());
        dto.setSolicitacaoRedefinicaoSenha(usuario.getSolicitacaoRedefinicaoSenha());
        dto.setDataSolicitacaoSenha(usuario.getDataSolicitacaoSenha());
        return dto;
    }

    private Usuario converterParaEntity(UsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setId(dto.getId());
        usuario.setUsername(dto.getUsername());
        usuario.setEmail(dto.getEmail());
        usuario.setRole(dto.getRole());
        usuario.setRa(dto.getRa());
        return usuario;
    }
    
    @GetMapping("/buscar")
    public List<UsuarioDTO> buscarUsuarios(@RequestParam String termo) {
        List<Usuario> usuarios = repository.findAll();

        return usuarios.stream()
                .filter(u ->
                        (u.getUsername() != null && u.getUsername().toLowerCase().contains(termo.toLowerCase())) ||
                        (u.getEmail() != null && u.getEmail().toLowerCase().contains(termo.toLowerCase())) ||
                        (u.getRa() != null && u.getRa().contains(termo))
                )
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }
    
    @GetMapping("/me/salvos")
    public ResponseEntity<?> listarSalvos(Authentication auth) {
        String username = auth.getName();
        Usuario usuario = repository.findByUsername(username).orElseThrow();
        return ResponseEntity.ok(usuario.getMateriaisSalvos());
    }
    
    @PutMapping("/{id}/inativar")
    public ResponseEntity<?> inativar(@PathVariable Long id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        usuario.setAtivo(false);
        repository.save(usuario);
        
        return ResponseEntity.ok("Usuário inativado com sucesso!");
    }
    
    @PutMapping("/{id}/alternar-status")
    public ResponseEntity<?> alternarStatus(@PathVariable Long id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        // Alterna entre true e false
        boolean novoStatus = !Boolean.TRUE.equals(usuario.getAtivo());
        usuario.setAtivo(novoStatus);
        repository.save(usuario);
        
        return ResponseEntity.ok(novoStatus ? "Usuário ativado!" : "Usuário inativado!");
    }
    
    @GetMapping("/me/perfil")
    public ResponseEntity<?> meuPerfil(Authentication auth) {
        String username = auth.getName();
        Usuario usuario = repository.findByUsername(username).orElseThrow();

        List<MaterialDTO> materiaisDTO = usuario.getMateriaisSalvos()
                .stream()
                .map(material -> new MaterialDTO(
                        material.getId(),
                        material.getTitulo(),
                        material.getConteudo(),
                        material.getUrl(),
                        material.getTipo().name(),
                        material.getCurtidas().size()
                ))
                .toList();
        
        PerfilDTO perfil = new PerfilDTO(
        	    usuario.getUsername(),
        	    usuario.getEmail(),
        	    usuario.getRole(),
        	    usuario.getRa(),
        	    materiaisDTO
        	);
        
        return ResponseEntity.ok(perfil);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getAdminStats() {
        Map<String, Long> stats = new HashMap<>();
        
        List<Usuario> usuarios = repository.findAll();
        
        stats.put("totalAlunos", usuarios.stream()
            .filter(u -> "ALUNO".equals(u.getRole()) && Boolean.TRUE.equals(u.getAtivo()))
            .count());
            
        stats.put("totalMonitores", usuarios.stream()
            .filter(u -> "MONITOR".equals(u.getRole()) && Boolean.TRUE.equals(u.getAtivo()))
            .count());
            
        stats.put("totalAdmins", usuarios.stream()
            .filter(u -> "ADMIN".equals(u.getRole()) && Boolean.TRUE.equals(u.getAtivo()))
            .count());
            
        stats.put("totalMateriais", 3563L);
        stats.put("totalRelatorios", 892L);
        
        return ResponseEntity.ok(stats);
    }

    // ========== REDEFINIÇÃO DE SENHA ==========

    @GetMapping("/{id}/verificar-senha")
    public ResponseEntity<Map<String, Boolean>> verificarRedefinicaoSenha(@PathVariable Long id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("precisaRedefinir", usuario.getSolicitacaoRedefinicaoSenha());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/aprovar-redefinicao")
    public ResponseEntity<?> aprovarRedefinicao(@PathVariable Long id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        usuario.setSolicitacaoRedefinicaoSenha(true);
        usuario.setDataSolicitacaoSenha(LocalDateTime.now());
        repository.save(usuario);
        
        return ResponseEntity.ok("Solicitação aprovada! O usuário poderá redefinir a senha.");
    }

    @PutMapping("/{id}/negar-redefinicao")
    public ResponseEntity<?> negarRedefinicao(@PathVariable Long id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        usuario.setSolicitacaoRedefinicaoSenha(false);
        usuario.setDataSolicitacaoSenha(null);
        repository.save(usuario);
        
        return ResponseEntity.ok("Solicitação negada!");
    }

    @PutMapping("/{id}/nova-senha")
    public ResponseEntity<?> novaSenha(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String novaSenha = body.get("novaSenha");
        
        if (novaSenha == null || novaSenha.length() < 8) {
            return ResponseEntity.badRequest().body("A senha deve ter pelo menos 8 caracteres");
        }
        
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        if (!Boolean.TRUE.equals(usuario.getSolicitacaoRedefinicaoSenha())) {
            return ResponseEntity.badRequest().body("Você não tem autorização para redefinir senha");
        }
        
        usuario.setSenha(encoder.encode(novaSenha));
        usuario.setSolicitacaoRedefinicaoSenha(false);
        usuario.setDataSolicitacaoSenha(null);
        repository.save(usuario);
        
        return ResponseEntity.ok("Senha redefinida com sucesso!");
    }

@GetMapping("/pedidos-senha")
public ResponseEntity<List<UsuarioDTO>> listarPedidosSenha() {
    // Só mostra os que têm solicitacao mas NÃO foram autorizados ainda
    // (ou seja, dataSolicitacaoSenha != null E solicitacaoRedefinicaoSenha == false)
    List<Usuario> usuarios = repository.findAll().stream()
            .filter(u -> u.getDataSolicitacaoSenha() != null 
                    && !Boolean.TRUE.equals(u.getSolicitacaoRedefinicaoSenha()))
            .sorted(Comparator.comparing(Usuario::getDataSolicitacaoSenha).reversed())
            .collect(Collectors.toList());
    
    List<UsuarioDTO> usuariosDTO = usuarios.stream()
            .map(this::converterParaDTO)
            .collect(Collectors.toList());
            
    return ResponseEntity.ok(usuariosDTO);
}
    
 // Usuário solicita redefinição de senha
    @PutMapping("/{id}/solicitar-redefinicao")
    public ResponseEntity<?> solicitarRedefinicao(@PathVariable Long id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        if (usuario.getAtivo() == false) {
            return ResponseEntity.badRequest().body("Usuário inativado. Procure o administrador.");
        }
        
        // Marca comopendente (dataSolicitacaoSenha = data atual)
        // Mas não seta solicitacaoRedefinicaoSenha = true ainda!
        // Isso fica pendente até o admin aprobar
        usuario.setDataSolicitacaoSenha(LocalDateTime.now());
        repository.save(usuario);
        
        return ResponseEntity.ok("Solicitação enviada! Procure o administrador para aprovar.");
    }
    
@GetMapping("/verificar-solicitacao")
public ResponseEntity<Map<String, Object>> verificarSolicitacao(@RequestParam String termo) {
    // Busca por email OU username
    Optional<Usuario> usuarioOpt = repository.findByEmail(termo);
    
    if (usuarioOpt.isEmpty()) {
        // Tenta buscar por username
        usuarioOpt = repository.findByUsername(termo);
    }
    
    if (usuarioOpt.isEmpty()) {
        return ResponseEntity.ok(Map.of("existe", false));
    }
    
    Usuario usuario = usuarioOpt.get();
    
    Map<String, Object> response = new HashMap<>();
    response.put("existe", true);
    response.put("userId", usuario.getId());
    response.put("username", usuario.getUsername());
    response.put("temSolicitacao", usuario.getDataSolicitacaoSenha() != null);
    response.put("aprovado", usuario.getSolicitacaoRedefinicaoSenha());
    
    return ResponseEntity.ok(response);
}
    
    
}