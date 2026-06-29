package com.mandatevacuum.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class MetricsController {

    private final JdbcTemplate jdbcTemplate;

    public MetricsController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/api/metrics")
    public List<Map<String, Object>> getAllMetrics() {
        String sql = """
                SELECT
                    c.category_code AS "categoryCode",
                    c.category_name AS "categoryName",
                    d.department_name AS "departmentName",
                    m.entropy_score AS "entropyScore",
                    m.half_life_days AS "halfLifeDays",
                    m.avg_resolution_days AS "avgResolutionDays",
                    m.normal_resolution_days AS "normalResolutionDays",
                    m.escalated_resolution_days AS "escalatedResolutionDays",
                    m.risk_level AS "riskLevel",
                    m.expected_improvement_pct AS "expectedImprovementPct"
                FROM category_metrics m
                JOIN complaint_categories c
                    ON m.category_id = c.category_id
                JOIN departments d
                    ON m.primary_department_id = d.department_id
                WHERE m.is_current = 'Y'
                ORDER BY c.category_id
                """;

        return jdbcTemplate.queryForList(sql);
    }

    @GetMapping("/api/metrics/{categoryCode}")
    public ResponseEntity<Map<String, Object>> getMetricByCategory(@PathVariable String categoryCode) {
        String sql = """
                SELECT
                    c.category_code AS "categoryCode",
                    c.category_name AS "categoryName",
                    d.department_name AS "departmentName",
                    m.entropy_score AS "entropyScore",
                    m.half_life_days AS "halfLifeDays",
                    m.avg_resolution_days AS "avgResolutionDays",
                    m.normal_resolution_days AS "normalResolutionDays",
                    m.escalated_resolution_days AS "escalatedResolutionDays",
                    m.risk_level AS "riskLevel",
                    m.expected_improvement_pct AS "expectedImprovementPct"
                FROM category_metrics m
                JOIN complaint_categories c
                    ON m.category_id = c.category_id
                JOIN departments d
                    ON m.primary_department_id = d.department_id
                WHERE m.is_current = 'Y'
                  AND UPPER(c.category_code) = UPPER(?)
                """;

        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, categoryCode);

        if (result.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(result.get(0));
    }
}