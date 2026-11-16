---
title: "Amazon RDS"
description: "AWS's managed relational database service supporting PostgreSQL, MySQL, and MariaDB with a 12-month free tier"
category: "backend"
type: "website"
url: "https://aws.amazon.com/rds"
pricing: "freemium"
tags:
  - backend
  - database
status: "published"
dateAdded: "2026-08-31"
---

# Amazon RDS

## Why Use It

Self-hosting relational databases in production requires ongoing overhead for OS patching, storage provisioning, multi-AZ replication, and automated disaster recovery. Amazon Relational Database Service (RDS) provides a fully managed database infrastructure supporting leading relational engines (PostgreSQL, MySQL, MariaDB, Oracle, SQL Server). It abstracts low-level administrative operations while offering enterprise-grade durability, automated backups, and read replica scaling.

## Key Capabilities

- Managed deployments for multiple popular relational engines with automatic version upgrades and patch management
- Multi-AZ synchronous replication providing automated failover and high availability for mission-critical workloads
- Automated point-in-time recovery and snapshot management with granular retention windows
- Native integration with AWS IAM database authentication, AWS KMS encryption at rest, and VPC network isolation

## Stack Fit & Workflow

The standard relational data tier for AWS-hosted backend architectures built with Node.js, Python, Java, Go, or Ruby, managed via Terraform, AWS CDK, or CloudFormation.
