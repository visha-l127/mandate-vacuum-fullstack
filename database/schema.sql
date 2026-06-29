CREATE TABLE data_source_batches (
    batch_id NUMBER PRIMARY KEY,
    source_name VARCHAR2(100) NOT NULL,
    source_type VARCHAR2(50) NOT NULL,
    imported_at DATE DEFAULT SYSDATE,
    total_records NUMBER,
    notes VARCHAR2(500)
);

CREATE TABLE departments (
    department_id NUMBER PRIMARY KEY,
    dept_code VARCHAR2(50) NOT NULL UNIQUE,
    department_name VARCHAR2(100) NOT NULL,
    contact_level VARCHAR2(50),
    is_active CHAR(1) DEFAULT 'Y',
    created_at DATE DEFAULT SYSDATE
);

CREATE TABLE complaint_categories (
    category_id NUMBER PRIMARY KEY,
    category_code VARCHAR2(50) NOT NULL UNIQUE,
    category_name VARCHAR2(100) NOT NULL,
    description VARCHAR2(500),
    is_active CHAR(1) DEFAULT 'Y',
    created_at DATE DEFAULT SYSDATE
);

CREATE TABLE historical_complaints (
    complaint_id NUMBER PRIMARY KEY,
    batch_id NUMBER,
    external_complaint_id VARCHAR2(100),
    category_id NUMBER NOT NULL,
    complaint_text CLOB,
    ward_name VARCHAR2(100),
    zone_name VARCHAR2(100),
    received_date DATE,
    resolved_date DATE,
    status VARCHAR2(50),
    initial_department_id NUMBER,
    final_department_id NUMBER,
    resolution_days NUMBER,
    created_at DATE DEFAULT SYSDATE,
    CONSTRAINT fk_hist_batch FOREIGN KEY (batch_id)
        REFERENCES data_source_batches(batch_id),
    CONSTRAINT fk_hist_category FOREIGN KEY (category_id)
        REFERENCES complaint_categories(category_id),
    CONSTRAINT fk_hist_initial_dept FOREIGN KEY (initial_department_id)
        REFERENCES departments(department_id),
    CONSTRAINT fk_hist_final_dept FOREIGN KEY (final_department_id)
        REFERENCES departments(department_id)
);

CREATE TABLE complaint_transfers (
    transfer_id NUMBER PRIMARY KEY,
    complaint_id NUMBER NOT NULL,
    from_department_id NUMBER,
    to_department_id NUMBER,
    transfer_order NUMBER,
    transfer_date DATE,
    transfer_reason VARCHAR2(500),
    CONSTRAINT fk_transfer_complaint FOREIGN KEY (complaint_id)
        REFERENCES historical_complaints(complaint_id),
    CONSTRAINT fk_transfer_from_dept FOREIGN KEY (from_department_id)
        REFERENCES departments(department_id),
    CONSTRAINT fk_transfer_to_dept FOREIGN KEY (to_department_id)
        REFERENCES departments(department_id)
);

CREATE TABLE category_department_ownership (
    ownership_id NUMBER PRIMARY KEY,
    category_id NUMBER NOT NULL,
    department_id NUMBER NOT NULL,
    complaint_count NUMBER NOT NULL,
    ownership_weight NUMBER(5,4) NOT NULL,
    calculated_at DATE DEFAULT SYSDATE,
    notes VARCHAR2(500),
    CONSTRAINT fk_owner_category FOREIGN KEY (category_id)
        REFERENCES complaint_categories(category_id),
    CONSTRAINT fk_owner_department FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
);

CREATE TABLE category_metrics (
    metric_id NUMBER PRIMARY KEY,
    category_id NUMBER NOT NULL,
    primary_department_id NUMBER NOT NULL,
    entropy_score NUMBER(5,2) NOT NULL,
    half_life_days NUMBER(6,2),
    avg_resolution_days NUMBER(6,2),
    normal_resolution_days NUMBER(6,2),
    escalated_resolution_days NUMBER(6,2),
    risk_level VARCHAR2(20),
    expected_improvement_pct NUMBER(5,2),
    metric_version VARCHAR2(20),
    is_current CHAR(1) DEFAULT 'Y',
    calculated_at DATE DEFAULT SYSDATE,
    CONSTRAINT fk_metric_category FOREIGN KEY (category_id)
        REFERENCES complaint_categories(category_id),
    CONSTRAINT fk_metric_primary_dept FOREIGN KEY (primary_department_id)
        REFERENCES departments(department_id)
);

CREATE TABLE citizen_analysis_requests (
    request_id NUMBER PRIMARY KEY,
    category_id NUMBER NOT NULL,
    description CLOB,
    risk_level VARCHAR2(20),
    entropy_score_snapshot NUMBER(5,2),
    normal_resolution_days NUMBER(6,2),
    escalated_resolution_days NUMBER(6,2),
    recommended_department_id NUMBER,
    reason VARCHAR2(1000),
    user_language VARCHAR2(10),
    created_at DATE DEFAULT SYSDATE,
    CONSTRAINT fk_request_category FOREIGN KEY (category_id)
        REFERENCES complaint_categories(category_id),
    CONSTRAINT fk_request_department FOREIGN KEY (recommended_department_id)
        REFERENCES departments(department_id)
);

CREATE SEQUENCE data_source_batches_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE departments_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE complaint_categories_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE historical_complaints_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE complaint_transfers_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE category_ownership_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE category_metrics_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE citizen_analysis_requests_seq START WITH 1 INCREMENT BY 1;

CREATE INDEX idx_hist_category ON historical_complaints(category_id);
CREATE INDEX idx_hist_status ON historical_complaints(status);
CREATE INDEX idx_hist_received_date ON historical_complaints(received_date);
CREATE INDEX idx_transfer_complaint ON complaint_transfers(complaint_id);
CREATE INDEX idx_owner_category ON category_department_ownership(category_id);
CREATE INDEX idx_metrics_category_current ON category_metrics(category_id, is_current);
CREATE INDEX idx_requests_category ON citizen_analysis_requests(category_id);
CREATE INDEX idx_requests_created_at ON citizen_analysis_requests(created_at);

COMMIT;