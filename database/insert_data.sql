INSERT INTO data_source_batches (
    batch_id,
    source_name,
    source_type,
    imported_at,
    total_records,
    notes
) VALUES (
    data_source_batches_seq.NEXTVAL,
    'BBMP Historical Civic Complaint Dataset',
    'Historical CSV Dataset',
    SYSDATE,
    3026,
    'Baseline dataset used for ownership entropy, accountability decay, and counterfactual simulation analysis.'
);

INSERT INTO departments (
    department_id,
    dept_code,
    department_name,
    contact_level,
    is_active,
    created_at
) VALUES (
    departments_seq.NEXTVAL,
    'ELECTRICAL',
    'Electrical Department',
    'Municipal Department',
    'Y',
    SYSDATE
);

INSERT INTO departments VALUES (
    departments_seq.NEXTVAL,
    'DRAINAGE',
    'Drainage Department',
    'Municipal Department',
    'Y',
    SYSDATE
);

INSERT INTO departments VALUES (
    departments_seq.NEXTVAL,
    'SANITATION',
    'Sanitation Department',
    'Municipal Department',
    'Y',
    SYSDATE
);

INSERT INTO departments VALUES (
    departments_seq.NEXTVAL,
    'ROADS',
    'Road Maintenance Department',
    'Municipal Department',
    'Y',
    SYSDATE
);

INSERT INTO departments VALUES (
    departments_seq.NEXTVAL,
    'FOREST',
    'Forest Department',
    'Municipal Department',
    'Y',
    SYSDATE
);

INSERT INTO departments VALUES (
    departments_seq.NEXTVAL,
    'HEALTH',
    'Health Department',
    'Municipal Department',
    'Y',
    SYSDATE
);

INSERT INTO complaint_categories VALUES (
    complaint_categories_seq.NEXTVAL,
    'ELECTRICAL',
    'Electrical',
    'Complaints related to street lights, electrical poles, and civic electrical infrastructure.',
    'Y',
    SYSDATE
);

INSERT INTO complaint_categories VALUES (
    complaint_categories_seq.NEXTVAL,
    'DRAIN',
    'Drain',
    'Complaints related to blocked drains, sewage overflow, and stormwater drainage issues.',
    'Y',
    SYSDATE
);

INSERT INTO complaint_categories VALUES (
    complaint_categories_seq.NEXTVAL,
    'SOLID_WASTE',
    'Solid Waste',
    'Complaints related to garbage collection, waste dumping, and sanitation handling.',
    'Y',
    SYSDATE
);

INSERT INTO complaint_categories VALUES (
    complaint_categories_seq.NEXTVAL,
    'ROAD_MAINTENANCE',
    'Road Maintenance',
    'Complaints related to potholes, damaged roads, and road repair delays.',
    'Y',
    SYSDATE
);

INSERT INTO complaint_categories VALUES (
    complaint_categories_seq.NEXTVAL,
    'FOREST',
    'Forest',
    'Complaints related to trees, branches, public greenery, and forest department responsibilities.',
    'Y',
    SYSDATE
);

INSERT INTO complaint_categories VALUES (
    complaint_categories_seq.NEXTVAL,
    'HEALTH',
    'Health',
    'Complaints related to public health, mosquito issues, hygiene, and disease prevention.',
    'Y',
    SYSDATE
);

INSERT INTO category_metrics (
    metric_id,
    category_id,
    primary_department_id,
    entropy_score,
    half_life_days,
    avg_resolution_days,
    normal_resolution_days,
    escalated_resolution_days,
    risk_level,
    expected_improvement_pct,
    metric_version,
    is_current,
    calculated_at
)
SELECT
    category_metrics_seq.NEXTVAL,
    c.category_id,
    d.department_id,
    0.98,
    33.9,
    9,
    9,
    4,
    'HIGH',
    55,
    'v1',
    'Y',
    SYSDATE
FROM complaint_categories c, departments d
WHERE c.category_code = 'ELECTRICAL'
AND d.dept_code = 'ELECTRICAL';

INSERT INTO category_metrics
SELECT
    category_metrics_seq.NEXTVAL,
    c.category_id,
    d.department_id,
    0.91,
    28.9,
    48,
    48,
    22,
    'HIGH',
    55,
    'v1',
    'Y',
    SYSDATE
FROM complaint_categories c, departments d
WHERE c.category_code = 'DRAIN'
AND d.dept_code = 'DRAINAGE';

INSERT INTO category_metrics
SELECT
    category_metrics_seq.NEXTVAL,
    c.category_id,
    d.department_id,
    0.99,
    34.1,
    35,
    35,
    16,
    'HIGH',
    54,
    'v1',
    'Y',
    SYSDATE
FROM complaint_categories c, departments d
WHERE c.category_code = 'SOLID_WASTE'
AND d.dept_code = 'SANITATION';

INSERT INTO category_metrics
SELECT
    category_metrics_seq.NEXTVAL,
    c.category_id,
    d.department_id,
    1.00,
    33.9,
    34,
    34,
    15,
    'HIGH',
    55,
    'v1',
    'Y',
    SYSDATE
FROM complaint_categories c, departments d
WHERE c.category_code = 'ROAD_MAINTENANCE'
AND d.dept_code = 'ROADS';

INSERT INTO category_metrics
SELECT
    category_metrics_seq.NEXTVAL,
    c.category_id,
    d.department_id,
    0.98,
    28.9,
    31,
    31,
    14,
    'HIGH',
    54,
    'v1',
    'Y',
    SYSDATE
FROM complaint_categories c, departments d
WHERE c.category_code = 'FOREST'
AND d.dept_code = 'FOREST';

INSERT INTO category_metrics
SELECT
    category_metrics_seq.NEXTVAL,
    c.category_id,
    d.department_id,
    1.00,
    38.1,
    38,
    38,
    17,
    'HIGH',
    55,
    'v1',
    'Y',
    SYSDATE
FROM complaint_categories c, departments d
WHERE c.category_code = 'HEALTH'
AND d.dept_code = 'HEALTH';

INSERT INTO category_department_ownership
SELECT category_ownership_seq.NEXTVAL, c.category_id, d.department_id, 120, 0.4000, SYSDATE, 'Primary ownership signal'
FROM complaint_categories c, departments d
WHERE c.category_code = 'ELECTRICAL' AND d.dept_code = 'ELECTRICAL';

INSERT INTO category_department_ownership
SELECT category_ownership_seq.NEXTVAL, c.category_id, d.department_id, 95, 0.3167, SYSDATE, 'Secondary ownership signal'
FROM complaint_categories c, departments d
WHERE c.category_code = 'ELECTRICAL' AND d.dept_code = 'ROADS';

INSERT INTO category_department_ownership
SELECT category_ownership_seq.NEXTVAL, c.category_id, d.department_id, 85, 0.2833, SYSDATE, 'Shared responsibility signal'
FROM complaint_categories c, departments d
WHERE c.category_code = 'ELECTRICAL' AND d.dept_code = 'SANITATION';

INSERT INTO category_department_ownership
SELECT category_ownership_seq.NEXTVAL, c.category_id, d.department_id, 140, 0.4667, SYSDATE, 'Primary ownership signal'
FROM complaint_categories c, departments d
WHERE c.category_code = 'DRAIN' AND d.dept_code = 'DRAINAGE';

INSERT INTO category_department_ownership
SELECT category_ownership_seq.NEXTVAL, c.category_id, d.department_id, 90, 0.3000, SYSDATE, 'Secondary ownership signal'
FROM complaint_categories c, departments d
WHERE c.category_code = 'DRAIN' AND d.dept_code = 'SANITATION';

INSERT INTO category_department_ownership
SELECT category_ownership_seq.NEXTVAL, c.category_id, d.department_id, 70, 0.2333, SYSDATE, 'Shared responsibility signal'
FROM complaint_categories c, departments d
WHERE c.category_code = 'DRAIN' AND d.dept_code = 'ROADS';

INSERT INTO category_department_ownership
SELECT category_ownership_seq.NEXTVAL, c.category_id, d.department_id, 125, 0.4167, SYSDATE, 'Primary ownership signal'
FROM complaint_categories c, departments d
WHERE c.category_code = 'SOLID_WASTE' AND d.dept_code = 'SANITATION';

INSERT INTO category_department_ownership
SELECT category_ownership_seq.NEXTVAL, c.category_id, d.department_id, 90, 0.3000, SYSDATE, 'Secondary ownership signal'
FROM complaint_categories c, departments d
WHERE c.category_code = 'SOLID_WASTE' AND d.dept_code = 'HEALTH';

INSERT INTO category_department_ownership
SELECT category_ownership_seq.NEXTVAL, c.category_id, d.department_id, 85, 0.2833, SYSDATE, 'Shared responsibility signal'
FROM complaint_categories c, departments d
WHERE c.category_code = 'SOLID_WASTE' AND d.dept_code = 'ROADS';

INSERT INTO category_department_ownership
SELECT category_ownership_seq.NEXTVAL, c.category_id, d.department_id, 110, 0.3667, SYSDATE, 'Primary ownership signal'
FROM complaint_categories c, departments d
WHERE c.category_code = 'ROAD_MAINTENANCE' AND d.dept_code = 'ROADS';

INSERT INTO category_department_ownership
SELECT category_ownership_seq.NEXTVAL, c.category_id, d.department_id, 100, 0.3333, SYSDATE, 'Secondary ownership signal'
FROM complaint_categories c, departments d
WHERE c.category_code = 'ROAD_MAINTENANCE' AND d.dept_code = 'DRAINAGE';

INSERT INTO category_department_ownership
SELECT category_ownership_seq.NEXTVAL, c.category_id, d.department_id, 90, 0.3000, SYSDATE, 'Shared responsibility signal'
FROM complaint_categories c, departments d
WHERE c.category_code = 'ROAD_MAINTENANCE' AND d.dept_code = 'SANITATION';

INSERT INTO category_department_ownership
SELECT category_ownership_seq.NEXTVAL, c.category_id, d.department_id, 130, 0.4333, SYSDATE, 'Primary ownership signal'
FROM complaint_categories c, departments d
WHERE c.category_code = 'FOREST' AND d.dept_code = 'FOREST';

INSERT INTO category_department_ownership
SELECT category_ownership_seq.NEXTVAL, c.category_id, d.department_id, 95, 0.3167, SYSDATE, 'Secondary ownership signal'
FROM complaint_categories c, departments d
WHERE c.category_code = 'FOREST' AND d.dept_code = 'ROADS';

INSERT INTO category_department_ownership
SELECT category_ownership_seq.NEXTVAL, c.category_id, d.department_id, 75, 0.2500, SYSDATE, 'Shared responsibility signal'
FROM complaint_categories c, departments d
WHERE c.category_code = 'FOREST' AND d.dept_code = 'SANITATION';

INSERT INTO category_department_ownership
SELECT category_ownership_seq.NEXTVAL, c.category_id, d.department_id, 115, 0.3833, SYSDATE, 'Primary ownership signal'
FROM complaint_categories c, departments d
WHERE c.category_code = 'HEALTH' AND d.dept_code = 'HEALTH';

INSERT INTO category_department_ownership
SELECT category_ownership_seq.NEXTVAL, c.category_id, d.department_id, 100, 0.3333, SYSDATE, 'Secondary ownership signal'
FROM complaint_categories c, departments d
WHERE c.category_code = 'HEALTH' AND d.dept_code = 'SANITATION';

INSERT INTO category_department_ownership
SELECT category_ownership_seq.NEXTVAL, c.category_id, d.department_id, 85, 0.2833, SYSDATE, 'Shared responsibility signal'
FROM complaint_categories c, departments d
WHERE c.category_code = 'HEALTH' AND d.dept_code = 'DRAINAGE';

COMMIT;