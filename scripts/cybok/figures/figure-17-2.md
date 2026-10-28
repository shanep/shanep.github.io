alt: Diagram of a five-stage secure CI/CD pipeline with a feedback loop, and the security controls used at each stage.
---
A diagram in two parts, under the title "Secure CI/CD pipeline".

**Top part: the pipeline.** Five boxes in a row, joined left to right by arrows:

1. "Pre-commit", subtitle "Developer checks"
2. "Build", subtitle "Automated analysis"
3. "Release gate", subtitle "Policy enforcement"
4. "Deploy", subtitle "Secrets injection"
5. "Monitor", subtitle "Runtime detection"

A dashed arrow runs from "Monitor" back to "Pre-commit", labelled "Findings feed back into security backlog".

A dashed line then separates this from the lower part, labelled "Security controls per stage".

**Bottom part: the controls.** One box per stage, each titled with the stage name:

| Stage | Controls |
|---|---|
| Pre-commit | Secrets detection; IaC lint; IDE SAST plugin; git-secrets / Gitleaks; TruffleHog |
| Build | SAST scan; SCA / dependency; Container image scan; IaC static analysis; Trivy / Checkov |
| Release gate | CVE threshold; SBOM generated; Threat model sign-off; SAST threshold; Policy gate enforce |
| Deploy | Secrets manager; Runtime injection; Least privilege IAM; Pipeline def review; Vault / Key Vault |
| Monitor (post-deploy) | DAST · RASP; SIEM alerting; Anomaly detection; Auth failure baselines |

The "Monitor (post-deploy)" box sits on its own row below the other four. Its four items are in two columns: "DAST · RASP" and "Anomaly detection" on the left, "SIEM alerting" and "Auth failure baselines" on the right. Each stage uses the same colour in the top and bottom parts.
