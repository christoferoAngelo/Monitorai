package com.eva.monitorai.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.eva.monitorai.model.entity.Curso;
import com.eva.monitorai.repository.CursoRepository;

// Criar Cursos ao inicializar


@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner carregarCursos(CursoRepository repository) {
        return args -> {

            // Evita duplicar dados toda vez que subir o sistema
            if (repository.count() == 0) {

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

                repository.save(c1);
                repository.save(c2);
                repository.save(c3);
                repository.save(c4);
            }
        };
    }
}
