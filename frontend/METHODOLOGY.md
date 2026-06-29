# Methodology — Mandate Vacuum Governance Intelligence

> This document describes the mathematical foundations, analytical concepts, and design decisions behind the Mandate Vacuum governance intelligence system.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Ownership Entropy](#1-ownership-entropy)
3. [Accountability Half-Life](#2-accountability-half-life)
4. [Counterfactual Resolution Simulator](#3-counterfactual-resolution-simulator)
5. [Data Schema](#data-schema)
6. [Interpretation Guide](#interpretation-guide)
7. [Limitations](#limitations)
8. [References](#references)

---

## System Overview

Mandate Vacuum analyzes historical complaint-transfer records to detect structural accountability failures in municipal governance. Rather than tracking complaint status, it studies the *architecture of failure* — identifying why responsibility erodes and how mandate structures can be redesigned.

The system uses three primary analytical constructs:

| Metric | What It Measures |
|--------|-----------------|
| **Ownership Entropy** | Instability of departmental mandate ownership |
| **Accountability Half-Life** | Speed of responsibility erosion over time |
| **Counterfactual Simulator** | Projected efficiency of alternate mandate structures |

---

## 1. Ownership Entropy

### Definition
Ownership Entropy measures how *unstable or fragmented* mandate ownership is for a given complaint category. It answers: **"How clearly does one department own this type of complaint?"**

### Formula

```
H(X) = -Σ pᵢ · log₂(pᵢ)
       i=1 to n
```

Where:
- `pᵢ` = proportion of complaint transfers received by department `i`
- `n` = total number of departments involved in transfers for this category
- `H(X)` = raw Shannon entropy (bits)

### Normalized Entropy

To make entropy comparable across categories with different numbers of departments:

```
H_normalized = H(X) / H_max

Where:
H_max = log₂(n)     (maximum possible entropy for n departments)
```

Normalized entropy ranges from **0.0 to 1.0**.

### Interpretation

| Normalized Entropy | Risk Level | Meaning |
|-------------------|------------|---------|
| 0.0 – 0.39 | 🟢 Low | One department clearly owns the mandate |
| 0.40 – 0.69 | 🟠 Medium | Shared or unclear ownership — boundary risk |
| 0.70 – 1.0 | 🔴 High | Full mandate vacuum — no clear owner |

### Example

For complaint category "Roads" with 30 transfers:
- PWD received 15 (50%) → p₁ = 0.50
- Transport received 10 (33%) → p₂ = 0.33
- Municipal received 5 (17%) → p₃ = 0.17

```
H = -(0.50·log₂0.50 + 0.33·log₂0.33 + 0.17·log₂0.17)
H = -(−0.50 + −0.53 + −0.42)
H = 1.45 bits

H_max = log₂(3) = 1.585
H_normalized = 1.45 / 1.585 = 0.915  →  🔴 HIGH RISK
```

### Theoretical Basis
Adapted from Shannon Information Entropy (Shannon, 1948), applied to probability distributions of departmental transfer receipts rather than information symbols.

---

## 2. Accountability Half-Life

### Definition
Accountability Half-Life quantifies how rapidly *responsibility erodes* as a complaint is transferred between departments over time. It answers: **"How long before accountability for this complaint effectively disappears?"**

### Formula

Accountability decays exponentially with each transfer:

```
R(t) = R₀ · e^(−λt)
```

Where:
- `R(t)` = accountability remaining at time `t` (days)
- `R₀` = initial accountability = 1.0 (full, at complaint filing)
- `λ` = decay constant (derived from transfer frequency)
- `t` = days since complaint was filed

### Decay Constant

```
λ = (number of transfers / total days open) × scaling_factor
```

The scaling factor (default = 0.5) is a calibration parameter that can be tuned against resolution outcome data.

### Half-Life Calculation

```
t½ = ln(2) / λ
```

This is the number of days until accountability drops to 50% of its initial value.

### Interpretation

| Half-Life | Meaning |
|-----------|---------|
| > 30 days | Accountability persists — resolution likely |
| 15–30 days | Moderate decay — resolution uncertain |
| < 15 days | Rapid erosion — complaint likely to go unresolved |

### Example

Complaint C001 (Roads): 3 transfers over 45 days
```
λ = (3 / 45) × 0.5 = 0.033
t½ = ln(2) / 0.033 = 21.0 days

After 45 days: R(45) = e^(−0.033 × 45) = 0.228
→ Only 22.8% accountability remains at resolution
```

### Theoretical Basis
Adapted from radioactive decay models in nuclear physics. Applied here to model the probabilistic erosion of administrative responsibility through bureaucratic transfer chains.

---

## 3. Counterfactual Resolution Simulator

### Definition
The Counterfactual Resolution Simulator evaluates how *alternate mandate structures* would perform compared to the current configuration. It answers: **"If we restructured ownership, how much would resolution efficiency improve?"**

### Approach

**Step 1 — Baseline Measurement**
- Calculate current Ownership Entropy and Accountability Half-Life for each complaint category
- Record baseline resolution rate and average days-to-resolution

**Step 2 — Simulate Alternate Structures**
For each simulation scenario, reassign primary ownership:
```
Scenario: Department X takes primary ownership of Category Y
→ Recalculate entropy assuming X handles 80% of transfers
→ Recalculate λ assuming fewer inter-department handoffs
→ Project resolution rate improvement
```

**Step 3 — Efficiency Delta**

```
ΔResolution = (Simulated_ResolutionRate - Baseline_ResolutionRate) / Baseline_ResolutionRate × 100
ΔDays = Baseline_AvgDays - Simulated_AvgDays
```

**Step 4 — Rank and Recommend**
Scenarios are ranked by:
1. Lowest entropy (clearest ownership)
2. Longest half-life (slowest accountability decay)
3. Highest resolution rate improvement

### Output Format

| Scenario | Primary Owner | Entropy | Half-Life (days) | Projected Resolution Δ |
|----------|--------------|---------|-----------------|----------------------|
| Baseline | Distributed | 0.91 | 12.3 | — |
| Scenario A | PWD | 0.34 | 28.7 | +41% |
| Scenario B | Municipal | 0.52 | 21.4 | +23% |

---

## Data Schema

### Input: `complaint_transfers.csv`

| Column | Type | Description |
|--------|------|-------------|
| `complaint_id` | string | Unique complaint identifier |
| `category` | string | Complaint type (Roads, Drainage, etc.) |
| `from_dept` | string | Department transferring the complaint |
| `to_dept` | string | Department receiving the complaint |
| `transfer_date` | date | Date of transfer (YYYY-MM-DD) |
| `resolved` | boolean | Whether resolved at this transfer |
| `days_open` | integer | Days since complaint was filed |

---

## Interpretation Guide

### Reading Entropy + Half-Life Together

| Entropy | Half-Life | Diagnosis | Action |
|---------|-----------|-----------|--------|
| 🔴 High | Short | Critical vacuum — ownership unclear AND accountability evaporates | Immediate mandate reassignment |
| 🔴 High | Long | Structural confusion but accountability persists | Clarify boundaries, monitor |
| 🟠 Medium | Short | Shared ownership with rapid decay | Strengthen primary owner role |
| 🟢 Low | Long | Healthy — clear ownership, persistent accountability | Maintain current structure |

---

## Limitations

- **Transfer frequency as proxy:** The model assumes transfer frequency correlates with accountability erosion. Direct measurement of accountability would require outcome surveys.
- **Scaling factor calibration:** The λ scaling factor (0.5) is a default. It should be calibrated against historical resolution outcome data for your specific municipality.
- **Data completeness:** Analysis quality is bounded by completeness of transfer records. Missing intermediate transfers will underestimate entropy.
- **Gemini API insights:** AI-generated narrative summaries are synthesized interpretations, not causal claims. They should be treated as decision-support, not ground truth.
- **Static snapshot:** The model analyzes historical data. Real-time governance dynamics may differ.

---

## References

- Shannon, C. E. (1948). *A Mathematical Theory of Communication.* Bell System Technical Journal, 27(3), 379–423.
- Rutherford, E. (1900). *A Radio-active Substance emitted from Thorium Compounds.* Philosophical Magazine. *(Basis for exponential decay model)*
- Ostrom, E. (1990). *Governing the Commons.* Cambridge University Press. *(Foundational theory on institutional mandate structures)*
