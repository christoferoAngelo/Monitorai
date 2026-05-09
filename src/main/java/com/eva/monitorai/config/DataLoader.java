package com.eva.monitorai.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.eva.monitorai.dto.DisciplinaDTO;
import com.eva.monitorai.model.entity.Curso;
import com.eva.monitorai.repository.CursoRepository;
import com.eva.monitorai.repository.DisciplinaRepository;
import com.eva.monitorai.service.DisciplinaService;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner carregarDados(
            CursoRepository cursoRepository,
            DisciplinaRepository disciplinaRepository,
            DisciplinaService disciplinaService
    ) {
        return args -> {

            // ========== 1. CRIAR CURSOS ==========
            if (cursoRepository.count() == 0) {

                Curso c1 = new Curso();
                c1.setNome("Análise e Desenvolvimento de Sistemas");
                c1.setCodigo("ADS001");

                Curso c2 = new Curso();
                c2.setNome("Engenharia de Software");
                c2.setCodigo("ENG001");

                Curso c3 = new Curso();
                c3.setNome("Ciência da Computação");
                c3.setCodigo("CIC001");

                Curso c4 = new Curso();
                c4.setNome("Sistemas de Informação");
                c4.setCodigo("SIN001");

                cursoRepository.save(c1);
                cursoRepository.save(c2);
                cursoRepository.save(c3);
                cursoRepository.save(c4);

                System.out.println("✅ Cursos carregados com sucesso!");
            }

            // ========== 2. CRIAR DISCIPLINAS (código gerado automaticamente) ==========
            if (disciplinaRepository.count() == 0) {

                // Buscar os cursos pelo código
                Curso ads = cursoRepository.findByCodigo("ADS001")
                        .orElseThrow(() -> new RuntimeException("Curso ADS001 não encontrado"));
                
                Curso eng = cursoRepository.findByCodigo("ENG001")
                        .orElseThrow(() -> new RuntimeException("Curso ENG001 não encontrado"));
                
                Curso cic = cursoRepository.findByCodigo("CIC001")
                        .orElseThrow(() -> new RuntimeException("Curso CIC001 não encontrado"));
                
                Curso sin = cursoRepository.findByCodigo("SIN001")
                        .orElseThrow(() -> new RuntimeException("Curso SIN001 não encontrado"));

                // =====================================
                // Disciplinas do curso ADS
                // O código vai ser GERADO AUTOMATICAMENTE pelo @PrePersist
                // Por isso passamos null no lugar do código
                // =====================================
                
                DisciplinaDTO d1 = new DisciplinaDTO(null, "Programação Orientada a Objetos", null, ads.getId(), null);
                DisciplinaDTO d2 = new DisciplinaDTO(null, "Banco de Dados", null, ads.getId(), null);
                DisciplinaDTO d3 = new DisciplinaDTO(null, "Engenharia de Software", null, ads.getId(), null);
                
                disciplinaService.criar(d1);
                disciplinaService.criar(d2);
                disciplinaService.criar(d3);

                // Disciplinas do curso ENG
                DisciplinaDTO d4 = new DisciplinaDTO(null, "Requisitos de Software", null, eng.getId(), null);
                DisciplinaDTO d5 = new DisciplinaDTO(null, "Teste de Software", null, eng.getId(), null);
                DisciplinaDTO d6 = new DisciplinaDTO(null, "Gerência de Configuração", null, eng.getId(), null);
                
                disciplinaService.criar(d4);
                disciplinaService.criar(d5);
                disciplinaService.criar(d6);

                // Disciplinas do curso CIC
                DisciplinaDTO d7 = new DisciplinaDTO(null, "Estrutura de Dados", null, cic.getId(), null);
                DisciplinaDTO d8 = new DisciplinaDTO(null, "Algoritmos Avançados", null, cic.getId(), null);
                DisciplinaDTO d9 = new DisciplinaDTO(null, "Inteligência Artificial", null, cic.getId(), null);
                
                disciplinaService.criar(d7);
                disciplinaService.criar(d8);
                disciplinaService.criar(d9);

                // Disciplinas do curso SIN
                DisciplinaDTO d10 = new DisciplinaDTO(null, "Gestão de Projetos", null, sin.getId(), null);
                DisciplinaDTO d11 = new DisciplinaDTO(null, "Arquitetura de Sistemas", null, sin.getId(), null);
                DisciplinaDTO d12 = new DisciplinaDTO(null, "Segurança da Informação", null, sin.getId(), null);
                
                disciplinaService.criar(d10);
                disciplinaService.criar(d11);
                disciplinaService.criar(d12);

                System.out.println("✅ Disciplinas carregadas com sucesso! (códigos gerados automaticamente)");
                
                // Opcional: Mostrar os códigos gerados
                disciplinaRepository.findAll().forEach(d -> {
                    System.out.println("📚 " + d.getNome() + " - Código: " + d.getCodigo());
                });
            }
        };
    }
}