---
title: 'Silicone Lattice Interface for Passive Deformation Sensing'
subtitle: 'Markerless, vision-based strain tracking for inferring subsurface muscle motion'
date: 2023-09-01 00:00:00
description:
featured_image: '/images/skin_patch.png'
---

# Silicone Lattice Interface for Passive Deformation Sensing

**Ongoing exploratory research into low-cost, wireless sensing of muscle motion via wearable soft interfaces**  
*Andrew Thompson*

---

<img src="{{site.baseurl}}/images/skin_patch.png" width="400">

## Concept

Most wearable sensing for muscle activity or limb motion relies on electronics worn directly on the body: IMUs, EMG electrodes, capacitive skins. These all require wiring, onboard power, and calibration, which adds cost, bulk, and points of failure, especially in assistive contexts where robustness and simplicity matter most.

This project explores an alternative: a passive, unpowered silicone lattice adhered to the skin, whose visible deformation is tracked by an ordinary camera. As the lattice stretches and compresses with the body underneath it, a vision pipeline infers strain across the surface, and from that, the underlying muscle motion, without a single wire touching the body.

## Approach

A soft silicone lattice (roughly a 4×4 grid of open cells) is cast from a 3D-printed mold and adhered over the area of interest, such as the forearm or wrist. A standard USB webcam watches the lattice; software segments it from the background, tracks the grid intersections frame to frame, and reconstructs a per-cell strain field in real time.

The tracking approach has evolved substantially since the project's early prototypes, which used printed ArUco markers at the lattice corners for orientation and scale. The current pipeline is markerless: it segments the lattice directly from video, models the underlying arm surface as a curved (cylindrical) patch rather than a flat plane, and uses a physically-informed elastic model to fill in node positions even where part of the lattice is briefly occluded or out of frame.

## Status

This is an active, ongoing personal research project, not tied to any lab or employer. The system currently runs in real time on a standard webcam and produces per-node displacement and per-triangle strain/stress estimates suitable for downstream gesture classification, control mapping, or biomechanical analysis.

<details markdown="1">
<summary><strong>Technical deep-dive: the current tracking pipeline</strong> (click to expand)</summary>

### Segmentation

Rather than relying on physical fiducial markers, the current pipeline uses Meta's Segment Anything Model 2 (SAM2) (Ravi et al., 2024) for lattice segmentation: a single click on the lattice in the first frame is enough for the mask to be propagated automatically through the rest of the video.

### Node (vertex) detection

Before the mesh can be reconciled frame to frame, the pipeline needs actual pixel observations of the lattice nodes:

1. **Channel selection** — the frame is converted to CIE L\*a\*b\*, and the a\* (red-green opponent) channel is used instead of luminance, since it separates green silicone from skin far more reliably than grayscale.
2. **Local contrast enhancement** via CLAHE (Contrast Limited Adaptive Histogram Equalization) (Zuiderveld, 1994), which boosts local contrast without over-amplifying specular highlights the way global histogram equalization would.
3. **Binarization** via Otsu's method (Otsu, 1979), which selects the threshold $$t$$ that maximizes between-class variance:

$$
t^* = \arg\max_t\ \omega_0(t)\ \omega_1(t)\ [\mu_0(t)-\mu_1(t)]^2
$$

where $$\omega_0,\omega_1$$ are the background/foreground pixel-fraction weights and $$\mu_0,\mu_1$$ their respective mean intensities.

4. **Connected-component extraction** (8-connectivity) over the open-cell interiors, with each region's centroid computed from its image moments:

$$
\bar x = \frac{M_{10}}{M_{00}}, \qquad \bar y = \frac{M_{01}}{M_{00}}
$$

5. **Node interpolation** — since a lattice intersection itself has no distinct colour signature to threshold on, its position is instead interpolated from the neighboring open-cell centroids along the local grid's horizontal and vertical axes.

### Node tracking and reconciliation

Detected nodes are cross-checked frame to frame against classical KLT (Lucas-Kanade) optical flow. When the two disagree, a policy favors the more reliable source depending on tracking confidence, and falls back to local corner search in a small window when both are lost.

### Elastic surface modeling

Node positions are reconciled through an As-Rigid-As-Possible (ARAP) deformation model (Sorkine & Alexa, 2007). Each frame, the solver alternates between two steps:

**Local step** — for each node $$i$$, find the rotation $$R_i$$ that best explains how its neighborhood has moved, via SVD of the edge-vector covariance matrix:

$$
S_i = \sum_{j \in N(i)} w_{ij}(p_i - p_j)(p_i' - p_j')^T = U_i \Sigma_i V_i^T, \qquad R_i = V_i U_i^T
$$

**Global step** — with all $$R_i$$ fixed, solve for new node positions $$p_i'$$ that jointly satisfy three competing objectives: match the observed (camera-tracked) nodes, stay locally rigid relative to neighbors, and avoid drifting arbitrarily far from the rest pose:

$$
\mathcal{E}(\{p_i'\}) = \lambda \sum_{i \in \text{obs}} \|p_i' - \hat p_i\|^2 + \sum_{(i,j)} w_{ij}\|(p_i'-p_j') - R_i(p_i - p_j)\|^2 + \epsilon \sum_i \|p_i' - p_i^{\text{rest}}\|^2
$$

This is a sparse linear least-squares problem in $$\{p_i'\}$$, solved via a cached LDLT factorization (the system matrix depends only on which nodes are currently observed, not their positions, so the factorization is reused across frames whenever that set is unchanged). Nodes temporarily out of view are governed almost entirely by the middle (rigidity) term, letting the mesh interpolate them physically rather than just holding them at their last known position.

The limb itself is modeled as a bicylindrical patch, with independent curvature across the limb ($$r_u$$) and along it ($$r_v$$):

$$
\theta_u = (u-0.5)\frac{L_{arc}}{r_u}, \qquad \phi_v = (v-0.5)\frac{L_{height}}{r_v}
$$

$$
S(u,v) = \begin{bmatrix} r_u\sin\theta_u \\ r_v\sin\phi_v \\ r_u\cos\theta_u + r_v(\cos\phi_v - 1) \end{bmatrix}
$$

As $$r_v \to \infty$$, this collapses to a flat single-cylinder model, useful as a sanity check on nearly-flat regions.

### Strain and stress estimation

For each triangle in a fixed Delaunay triangulation of the rest-state mesh, the deformation gradient $$F$$ maps reference edge vectors to current ones:

$$
F = [B-A, C-A][B_0-A_0, C_0-A_0]^{-1}
$$

For small strains, the linearized strain tensor is used; for larger deformations (beyond roughly 5-10%), the Green-Lagrange form is more accurate:

$$
E_{\text{lin}} = \frac{1}{2}(F+F^T) - I \qquad\qquad E_{\text{GL}} = \frac{1}{2}(F^TF - I)
$$

Given the silicone's known material properties (EcoFlex 00-30: $$E \approx 69$$ kPa, $$\nu \approx 0.499$$), a plane-stress model converts strain to stress:

$$
\sigma_{xx} = \frac{E}{1-\nu^2}(\varepsilon_{xx}+\nu\varepsilon_{yy}), \qquad \sigma_{yy} = \frac{E}{1-\nu^2}(\varepsilon_{yy}+\nu\varepsilon_{xx}), \qquad \sigma_{xy}=2G\varepsilon_{xy}, \quad G=\frac{E}{2(1+\nu)}
$$

$$
\sigma_{vm} = \sqrt{\sigma_{xx}^2 - \sigma_{xx}\sigma_{yy}+\sigma_{yy}^2+3\sigma_{xy}^2}
$$

von Mises stress collapses the full stress tensor into a single scalar "how loaded is this patch of skin" value, giving a per-region proxy for the underlying muscle activity without needing to interpret the raw tensor components directly.

### Hardware

A single 2D USB webcam is sufficient for the core pipeline; the system also supports RealSense and ZED depth cameras for future 3D (out-of-plane) strain estimation, which a monocular setup cannot capture.

### References

- Sorkine, O., & Alexa, M. (2007). As-Rigid-As-Possible Surface Modeling. *Symposium on Geometry Processing (SGP)*. [Eurographics Digital Library](https://diglib.eg.org/items/e0b21a71-350e-41e7-a586-3bfa526ed21c)
- Ravi, N., Gabeur, V., Hu, Y.-T., et al. (2024). SAM 2: Segment Anything in Images and Videos. *arXiv:2408.00714*. [arXiv](https://arxiv.org/abs/2408.00714)
- Otsu, N. (1979). A Threshold Selection Method from Gray-Level Histograms. *IEEE Transactions on Systems, Man, and Cybernetics*, 9(1), 62-66. [DOI](https://doi.org/10.1109/TSMC.1979.4310076)
- Zuiderveld, K. (1994). Contrast Limited Adaptive Histogram Equalization. In *Graphics Gems IV* (pp. 474-485). [DOI](https://doi.org/10.1016/b978-0-12-336156-1.50061-6)

</details>

## Tools & Materials

- ROS2, OpenCV, Meta SAM2
- Silicone casting (EcoFlex 00-30), 3D-printed molds
- USB webcam (RealSense/ZED support in progress)
- Python, C++, Eigen
