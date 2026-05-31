package com.eva.monitorai.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.eva.monitorai.model.entity.Monitor;
import com.eva.monitorai.repository.MonitorRepository;

@RestController
@RequestMapping("/monitores")
@CrossOrigin("*")
public class MonitorController {

    @Autowired
    private MonitorRepository monitorRepository;

    @GetMapping
    public List<Monitor> listarTodos() {
        return monitorRepository.findAll();
    }

    @GetMapping("/ativos")
    public List<Monitor> listarAtivos() {
        return monitorRepository.findByAtivoTrue();
    }
}