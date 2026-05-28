package com.eva.monitorai.config;

import java.util.List;

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

            // =====================================
            // CURSOS
            // =====================================

            if (cursoRepository.count() == 0) {

                criarCurso(
                        cursoRepository,
                        "Análise e Desenvolvimento de Sistemas",
                        "ADS001"
                );

                criarCurso(
                        cursoRepository,
                        "Engenharia de Software",
                        "ENG001"
                );

                criarCurso(
                        cursoRepository,
                        "Ciência da Computação",
                        "CIC001"
                );

                criarCurso(
                        cursoRepository,
                        "Sistemas de Informação",
                        "SIN001"
                );

                System.out.println("✅ Cursos carregados!");
            }

            // =====================================
            // DISCIPLINAS
            // =====================================

            if (disciplinaRepository.count() == 0) {

                Curso ads = buscarCurso(cursoRepository, "ADS001");
                Curso eng = buscarCurso(cursoRepository, "ENG001");
                Curso cic = buscarCurso(cursoRepository, "CIC001");
                Curso sin = buscarCurso(cursoRepository, "SIN001");

                // =====================================
                // DISCIPLINAS COMPARTILHADAS
                // =====================================

                criarDisciplina(
                        disciplinaService,
                        "Banco de Dados",
                        List.of(ads.getId(), sin.getId())
                );

                criarDisciplina(
                        disciplinaService,
                        "Engenharia de Software",
                        List.of(ads.getId(), eng.getId())
                );

                criarDisciplina(
                        disciplinaService,
                        "Programação Orientada a Objetos",
                        List.of(ads.getId(), cic.getId())
                );

                criarDisciplina(
                        disciplinaService,
                        "Estrutura de Dados",
                        List.of(cic.getId(), ads.getId())
                );

                criarDisciplina(
                        disciplinaService,
                        "Inteligência Artificial",
                        List.of(cic.getId())
                );

                criarDisciplina(
                        disciplinaService,
                        "Teste de Software",
                        List.of(eng.getId())
                );

                criarDisciplina(
                        disciplinaService,
                        "Gestão de Projetos",
                        List.of(sin.getId(), eng.getId())
                );

                criarDisciplina(
                        disciplinaService,
                        "Segurança da Informação",
                        List.of(sin.getId())
                );

                System.out.println("✅ Disciplinas carregadas!");
            }
        };
    }

    // =====================================
    // MÉTODO AUXILIAR -> CRIAR CURSO
    // =====================================

    private void criarCurso(
            CursoRepository repository,
            String nome,
            String codigo
    ) {

        Curso curso = new Curso();

        curso.setNome(nome);
        curso.setCodigo(codigo);

        repository.save(curso);
    }

    // =====================================
    // MÉTODO AUXILIAR -> BUSCAR CURSO
    // =====================================

    private Curso buscarCurso(
            CursoRepository repository,
            String codigo
    ) {

        return repository.findByCodigo(codigo)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Curso não encontrado: " + codigo
                        )
                );
    }

    // =====================================
    // MÉTODO AUXILIAR -> CRIAR DISCIPLINA
    // =====================================

    private void criarDisciplina(
            DisciplinaService service,
            String nome,
            List<Long> cursosIds
    ) {

        DisciplinaDTO dto = new DisciplinaDTO();

        dto.setNome(nome);

        // código automático
        dto.setCodigo(null);

        dto.setCursosIds(cursosIds);

        dto.setMonitorId(null);
        
        dto.setSemestre(1);

        service.criar(dto);
    }
}