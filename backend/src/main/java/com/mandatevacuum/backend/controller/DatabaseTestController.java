package com.mandatevacuum.backend.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DatabaseTestController {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseTestController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/api/test-db")
    public String testDatabaseConnection() {
        Integer departmentCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM departments",
                Integer.class
        );

        return "Oracle connected successfully. Departments count = " + departmentCount;
    }
}