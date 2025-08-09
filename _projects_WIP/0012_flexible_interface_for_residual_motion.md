---
title: 'Silicone Lattice Interface for Passive Deformation Sensing'
subtitle:
date: 2018-06-30 00:00:00
description:
featured_image: '/images/BME_462_rigid_foot_v2_step0.png'
---

# Silicone Lattice Interface for Passive Deformation Sensing

**Exploratory research into soft wearable interfaces using passive vision-based deformation detection**  
*Andrew Thompson | Northwestern University*

---

## Concept

This project explored the feasibility of using **flexible silicone lattice structures** as a passive, non-electronic interface for tracking body movement and contact. The key idea was to leverage the **visual deformation patterns** of the lattice—captured by an external camera—as a signal for control input or biomechanical state inference.

The project was conceptualized as a **low-cost, customizable sensing modality** that could serve as an alternative to IMUs or capacitive skins, especially in scenarios where wiring or onboard power were impractical.

> _**📷 This would be a good place to include an image or rendering of the silicone lattice on a forearm or back of hand**_

---

## Motivation

- Reduce reliance on powered or embedded sensors in wearable robotics.
- Explore **vision-based sensing** for soft interfaces using off-the-shelf hardware.
- Investigate **deformation tracking** for gesture classification or control mapping.
- Create easily customizable, body-conforming sensing surfaces.

---

## Approach

### Fabrication

- Used laser-cut molds and pourable silicone (Dragon Skin 10, EcoFlex).
- Lattice geometry optimized for visual trackability and structural integrity.
- Experimented with embedded fiducials (colored dots, printed patterns).

### Vision Pipeline

- Used external webcam or smartphone to record lattice deformation.
- Implemented custom OpenCV pipeline:
  - Contour detection  
  - Edge tracking and lattice graph extraction  
  - Deformation vector field estimation  
- Explored mapping deformation vectors to categorical gestures or commands.

> _**This would be a good place to show side-by-side: undeformed vs. deformed lattice image with overlaid CV features**_

---

## Key Insights

- Lattices produced **rich, structured deformation fields** with minimal fabrication cost.
- Deformation modes were **distinct and repeatable**, especially for finger or wrist movement.
- Lighting, skin occlusion, and camera angle posed significant noise challenges.
- Proposed approach could support **on-body, vision-only interfaces** with further refinement.

---

## Outcome & Status

While the project was not pursued to full deployment or publication, it offered valuable insights into the **intersection of soft material sensing and passive computer vision**. Future directions could include:

- Real-time lattice pose estimation with deep learning  
- Integration with wearable projection or AR systems  
- Application to posture tracking, rehab, or accessible gaming

> _**This would be a good place to include speculative render or use-case sketch (e.g. lattice + AR overlay)**_

---

## Tools & Materials

- OpenCV (C++), OpenGL, Python, ROS2
- Silicone (EcoFlex, Dragon Skin), acrylic molds  
- USB webcam, ring lighting, tripod rig  
- Hand-cut and 3D printed strain testing jigs

---

## Status

Discontinued research thread (2023–2024).  
Available upon request: fabrication protocol notes, early CV prototypes, deformation videos.

---
