package com.eva.monitorai.service;

import com.eva.monitorai.model.entity.Curtida;
import com.eva.monitorai.dto.CurtidaDTO;
import com.eva.monitorai.model.entity.Material;
import com.eva.monitorai.model.entity.Usuario;
import com.eva.monitorai.repository.CurtidaRepository;
import com.eva.monitorai.repository.MaterialRepository;
import com.eva.monitorai.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CurtidaService {

    @Autowired
    private CurtidaRepository curtidaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private MaterialRepository materialRepository;

    public CurtidaDTO toggleCurtida(
            Long materialId,
            String username
    ){

        Usuario usuario = usuarioRepository
                .findByUsername(username)
                .orElseThrow();

        Material material = materialRepository
                .findById(materialId)
                .orElseThrow();

        boolean curtido;

        var curtidaExistente =
                curtidaRepository.findByUsuarioAndMaterial(
                        usuario,
                        material
                );

        if(curtidaExistente.isPresent()){

            curtidaRepository.delete(
                    curtidaExistente.get()
            );

            curtido = false;

        }else{

            Curtida curtida = new Curtida();

            curtida.setUsuario(usuario);
            curtida.setMaterial(material);

            curtidaRepository.save(curtida);

            curtido = true;
        }

        long totalCurtidas =
                curtidaRepository.countByMaterial(material);

        return new CurtidaDTO(
                material.getId(),
                totalCurtidas,
                curtido
        );
    }
}