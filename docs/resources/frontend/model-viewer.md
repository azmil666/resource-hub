---
title: "Model Viewer"
description: "Google web component for displaying interactive 3D models and augmented reality on the web."
category: "frontend"
type: "library"
url: "https://modelviewer.dev"
pricing: "free"
tags:
  - 3d
  - webgl
  - augmented-reality
  - frontend
  - open-sourcestatus: "published"
status: "published"
dateAdded: "2026-09-27"
---

# Model Viewer

## Why Use It

Embedding interactive 3D models and mobile augmented reality (AR) typically requires heavy WebGL boilerplate, custom shader compilation, and divergent platform code for iOS Quick Look and Android Scene Viewer. Google's <model-viewer> is an open-source, production-grade Web Component that renders interactive 3D GLTF/GLB models directly in HTML with a single declarative tag. It handles responsive canvas resizing, physically based rendering (PBR), and native mobile AR handoffs automatically.

## Key Capabilities

- Declarative HTML custom element (<model-viewer src="model.glb">) requiring zero custom JavaScript for 3D rendering
- One-click native AR activation on iOS (ARKit Quick Look) and Android (ARCore Scene Viewer / WebXR)
- Physically Based Rendering (PBR) with customizable HDR lighting environment maps, exposure, and shadow softness
- Configurable camera controls, auto-rotation, hotspots, and skeletal animation playback via standard HTML attributes

## Stack Fit & Workflow

The standard 3D web component for e-commerce product visualizers, portfolio showcases, and interactive educational sites across any web stack.
