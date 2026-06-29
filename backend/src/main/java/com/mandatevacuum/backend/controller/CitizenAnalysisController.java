package com.mandatevacuum.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/citizen")
public class CitizenAnalysisController {

    private final JdbcTemplate jdbcTemplate;

    public CitizenAnalysisController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeComplaint(@RequestBody CitizenAnalysisRequest request) {

        String sql = """
                SELECT
                    c.category_id AS "categoryId",
                    c.category_code AS "categoryCode",
                    c.category_name AS "categoryName",
                    d.department_id AS "recommendedDepartmentId",
                    d.department_name AS "recommendedDepartmentName",
                    m.entropy_score AS "entropyScore",
                    m.half_life_days AS "halfLifeDays",
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

        List<Map<String, Object>> result = jdbcTemplate.queryForList(sql, request.getCategoryCode());

        if (result.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> metric = result.get(0);

        String reason = "This complaint category shows high ownership fragmentation, so it may face delay if responsibility is not clearly assigned.";

        jdbcTemplate.update(
                """
                INSERT INTO citizen_analysis_requests (
                    request_id,
                    category_id,
                    description,
                    risk_level,
                    entropy_score_snapshot,
                    normal_resolution_days,
                    escalated_resolution_days,
                    recommended_department_id,
                    reason,
                    user_language,
                    created_at
                ) VALUES (
                    citizen_analysis_requests_seq.NEXTVAL,
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, SYSDATE
                )
                """,
                metric.get("categoryId"),
                request.getDescription(),
                metric.get("riskLevel"),
                metric.get("entropyScore"),
                metric.get("normalResolutionDays"),
                metric.get("escalatedResolutionDays"),
                metric.get("recommendedDepartmentId"),
                reason,
                request.getLanguage() == null ? "en" : request.getLanguage()
        );

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("categoryCode", metric.get("categoryCode"));
        response.put("categoryName", metric.get("categoryName"));
        response.put("riskLevel", metric.get("riskLevel"));
        response.put("entropyScore", metric.get("entropyScore"));
        response.put("halfLifeDays", metric.get("halfLifeDays"));
        response.put("normalResolutionDays", metric.get("normalResolutionDays"));
        response.put("escalatedResolutionDays", metric.get("escalatedResolutionDays"));
        response.put("expectedImprovementPct", metric.get("expectedImprovementPct"));
        response.put("recommendedDepartment", metric.get("recommendedDepartmentName"));
        response.put("reason", reason);
        response.put("savedToDatabase", true);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/requests")
    public List<Map<String, Object>> getRecentCitizenRequests() {
        String sql = """
                SELECT *
                FROM (
                    SELECT
                        r.request_id AS "requestId",
                        c.category_name AS "categoryName",
                        r.description AS "description",
                        r.risk_level AS "riskLevel",
                        d.department_name AS "recommendedDepartment",
                        r.normal_resolution_days AS "normalResolutionDays",
                        r.escalated_resolution_days AS "escalatedResolutionDays",
                        TO_CHAR(r.created_at, 'YYYY-MM-DD HH24:MI:SS') AS "createdAt"
                    FROM citizen_analysis_requests r
                    JOIN complaint_categories c
                        ON r.category_id = c.category_id
                    LEFT JOIN departments d
                        ON r.recommended_department_id = d.department_id
                    ORDER BY r.request_id DESC
                )
                WHERE ROWNUM <= 10
                """;

        return jdbcTemplate.queryForList(sql);
    }

    public static class CitizenAnalysisRequest {
        private String categoryCode;
        private String description;
        private String language;

        public String getCategoryCode() {
            return categoryCode;
        }

        public void setCategoryCode(String categoryCode) {
            this.categoryCode = categoryCode;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getLanguage() {
            return language;
        }

        public void setLanguage(String language) {
            this.language = language;
        }
    }
}