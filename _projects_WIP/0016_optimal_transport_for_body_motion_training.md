---
title: 'Optimal Transport for Effort-Minimizing Trajectory Alignment in Assistive Interfaces'
subtitle:
date: 2018-06-30 00:00:00
description:
featured_image: '/images/BME_462_rigid_foot_v2_step0.png'
---

# Optimal Transport for Effort-Minimizing Trajectory Alignment in Assistive Interfaces

**Using OT to align expert and non-expert body motion via keypoint data for personalized control and rehabilitation**  
*Andrew Thompson | Northwestern University + Shirley Ryan AbilityLab*

---

## Overview

This ongoing project uses **Optimal Transport (OT)** to analyze, compare, and interpolate between **expert and non-expert body motions**, with the goal of identifying **effort-minimizing intermediate trajectories**. By representing motion data as distributions over pose keypoints, OT is used to discover paths in latent or pose space that support more accessible control strategies or rehabilitative goals.

This work bridges intent modeling and assistive adaptation, allowing systems to better align with the user's physical capabilities and effort profile—especially for individuals with motor impairments.

> _**📷 This would be a good place to include visualizations of expert vs. non-expert trajectories and the OT interpolation between them**_

---

## Motivation

- Expert demonstrators often generate trajectories that non-expert or motor-impaired users **cannot replicate directly**.
- Traditional imitation learning penalizes deviation from expert paths rather than accounting for **user-specific constraints**.
- By using OT to **interpolate** between expert and user trajectories, we aim to:
  - Reduce physical or cognitive effort  
  - Preserve task-relevant movement structure  
  - Personalize control mappings or training curricula

---

## Methodology

### Data Format

- Pose data collected from body keypoints (e.g. OpenPose, MediaPipe)
- Represented as time-aligned 2D or 3D trajectory clouds
- Control space (e.g., arm pose, IMU-derived vector, endpoint trajectory) treated as support domains

### OT Mapping

- Compute OT plan between expert and user pose distributions (Wasserstein or Gromov-Wasserstein)
- Use the OT coupling to define **intermediate pose trajectories**  
  (e.g., 70% user / 30% expert weight)
- Reconstruct trajectories for use in:
  - Personalized controller tuning  
  - Rehabilitative guidance  
  - Motion synthesis or data augmentation

> _**Include figure showing pose interpolation over time between expert and adapted intermediate**_

---

## Early Findings

- OT-generated interpolants preserve key spatiotemporal structure while reducing task-relevant motion demands.
- Intermediate trajectories often lie **within the user's motion manifold**, improving feasibility and comfort.
- Pose-to-pose alignment can be used to warp expert data for personalized imitation learning or feedback overlays.

---

## Applications & Future Work

- **Assistive teleoperation**: use OT-based motion plans to personalize mappings for high-DOF robotic arms
- **Rehabilitation robotics**: define reachable goals and training targets aligned with user capacity
- **Motor skill acquisition**: gradual adaptation of expert trajectories to learner trajectories
- **Shared autonomy blending**: OT couplings as latent priors for control arbitration

---

## Tools & Frameworks

- OpenPose, MediaPipe for body keypoints  
- POT + GeomLoss for OT computation (Wasserstein, GW)  
- Python (NumPy, SciPy, PyTorch), scikit-learn, Matplotlib  
- Early tests integra
