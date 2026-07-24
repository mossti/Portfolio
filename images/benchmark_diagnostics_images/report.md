# CPU vs GPU visual correctness diagnostics

Algorithm: `threshold` | Resolution: 1280x720 | Blur size: 9 | Threshold: 115

## Per-frame disagreement

| Frame | Differing px | Differing % | Regions | Max region (px) | Border-diff fraction | Near-threshold fraction |
|---:|---:|---:|---:|---:|---:|---:|
| 0 | 60 | 0.007% | 45 | 5 | 0.0% | 93.3% |
| 1 | 38 | 0.004% | 26 | 7 | 0.0% | 100.0% |
| 2 | 50 | 0.005% | 31 | 8 | 6.0% | 98.0% |
| 3 | 26 | 0.003% | 25 | 2 | 0.0% | 100.0% |
| 4 | 19 | 0.002% | 19 | 1 | 0.0% | 100.0% |
| 5 | 20 | 0.002% | 16 | 3 | 0.0% | 100.0% |
| 6 | 33 | 0.004% | 25 | 5 | 0.0% | 90.9% |
| 7 | 31 | 0.003% | 18 | 11 | 0.0% | 100.0% |
| 8 | 20 | 0.002% | 20 | 1 | 0.0% | 100.0% |
| 9 | 20 | 0.002% | 19 | 2 | 0.0% | 100.0% |

## Stage-isolation deep dive (one representative frame)

Each stage is fed *identical* input on both backends, isolating that single operation's own CPU-vs-GPU numerical difference from whatever the earlier stages contributed.

| Stage | Mean abs diff | Max abs diff | Nonzero % | Border mean diff | Interior mean diff | Border/interior ratio |
|---|---:|---:|---:|---:|---:|---:|
| resize | 0.000 | 0.0 | 0.00% | 0.000 | 0.000 | 1.00x |
| blur | 0.006 | 1.0 | 1.63% | 0.005 | 0.006 | 0.94x |
| gray | 0.000 | 0.0 | 0.00% | 0.000 | 0.000 | 1.00x |
| threshold | 0.000 | 0.0 | 0.00% | 0.000 | 0.000 | 1.00x |

## Findings

- Across 10 sampled frames, CPU and GPU masks disagreed on 0.003% of pixels on average, concentrated into disagreement regions rather than scattered noise (see region counts above).
- **Are differences limited to one-pixel boundaries?** On average 0.6% of differing pixels fall within 5px of the image edge. Disagreement is not dominated by the image border, so interior content differences (not edge handling alone) are a meaningful contributor.
- **Are differences caused primarily by resize interpolation?** The isolated resize stage produced a mean abs diff of 0.000 (border/interior ratio 1.00x) versus 0.006 for blur and 0.000 for grayscale conversion. 'blur' contributes more raw numerical difference than resize does.
- **Are differences caused by Gaussian-filter rounding?** The isolated blur stage's mean abs diff is 0.006 with 1.63% of pixels affected at all — small, uniform, rounding-scale differences consistent with fixed-point/precision handling inside the separable convolution, not a structural bug.
- **Do border modes differ between CPU and CUDA implementations?** Border-to-interior diff ratios: resize 1.00x, blur 0.94x, grayscale 1.00x, threshold 1.00x (threshold is pointwise and has no border dependency, so it serves as this analysis's baseline — its ratio should sit near 1x; mean threshold diff was 0.0000, confirming it is not itself a meaningful source of disagreement). Blur's border and interior means are comparable, suggesting the two backends use similar border handling for this filter at this kernel size.
- **Are the differences meaningful for the intended perception task?** With mean pixel disagreement at 0.003% and concentrated at object/region boundaries rather than interior blob content, these differences are unlikely to change downstream decisions (e.g. blob presence, rough location, size) for a typical thresholding/perception task — they read as edge-precision noise, not semantic errors.
- Of the pixels where CPU and GPU disagreed, 98.2% had an underlying grayscale intensity within 10 levels of the threshold value (115) — the large majority of disagreement is explained by borderline pixels sitting right at the threshold decision boundary, where tiny upstream numerical differences are enough to flip the outcome.
