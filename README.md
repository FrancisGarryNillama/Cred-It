# 🎓 Credit Evaluation System

A comprehensive Django application designed for managing the **transfer credit evaluation** and **Transcript of Records (TOR)** processing for educational institutions.

## 📝 Table of Contents

1.  [✨ Key Features](#-key-features)
2.  [🛠️ Tech Stack](#️-tech-stack)
3.  [🚀 Quick Start](#-quick-start)
    * [Prerequisites](#prerequisites)
    * [Local Development Setup](#local-development-setup)
    * [Docker Setup](#docker-setup)
4.  [📂 Project Structure](#-project-structure)
5.  [🔐 Demo Accounts](#-demo-accounts)
6.  [🌟 Project Context](#-project-context)

---

## ✨ Key Features

This system streamlines the entire credit evaluation pipeline:

* **Student & Profile Management**: Complete account registration, profiles, and management for all users.
* **📄 Intelligent TOR Processing**: Automatic extraction of subject and grade data from Transcripts of Records using **EasyOCR**.
* **🔄 Structured Workflow System**: A robust three-stage processing flow for evaluation requests:
    * `Request` → `Pending` → `Final`
* **🎯 AI-Powered Curriculum Matching**: Uses advanced algorithms to match incoming subjects to the current curriculum with a quantifiable similarity score.
* **📊 Flexible Credit Evaluation**: Supports both standard and reverse grading systems for accurate credit allocation.
* **📈 Analytics & Reporting**: Provides comprehensive statistics and reports on the evaluation process and results.
* **🔒 Production-Ready Security**: Implements proper authentication and authorization mechanisms for a secure deployment.

---

## 🛠️ Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend** | `Django 4.2` | Primary web framework. |
| **API** | `Django REST Framework` | Used for building powerful RESTful APIs. |
| **Database** | `PostgreSQL` | Robust and scalable relational database. |
| **Cache** | `Redis` | High-performance key-value store for caching. |
| **OCR/Vision** | `EasyOCR`, `OpenCV` | Core libraries for text extraction and image processing. |
| **Deployment** | `Docker`, `Docker Compose` | Containerization for consistent environments. |
| **Server** | `Gunicorn`, `Nginx` | Production-grade web server and reverse proxy setup. |
| **Testing** | `pytest`, `pytest-django` | Frameworks for reliable and scalable unit/integration testing. |

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed on your system:

* `Python 3.11+`
* `PostgreSQL 15+`
* `Redis 7+`
* `Node.js 18+` (Required for the separate frontend application, if applicable)

---

### Local Development Setup

Follow these steps to get the application running locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/credit-system.git
   cd credit-system
