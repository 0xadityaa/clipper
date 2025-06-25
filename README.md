# Clipper 🎬

Clipper is an innovative tool designed to help content creators effortlessly repurpose long-form video content—such as podcasts, interviews, and live streams—into engaging, bite-sized clips for platforms like TikTok, Instagram Reels, and YouTube Shorts. This project was proudly developed in 24 hours for the Hack AI Toronto hackathon.

## ✨ The Problem

Content creators invest significant time and effort into producing high-quality long-form content. However, the modern social media landscape, dominated by short-form video, requires a different content strategy. Manually identifying the most compelling moments and editing them into short, shareable clips is a tedious and time-consuming process.

## 🚀 The Solution

Clipper automates this entire workflow. It takes a long-form video, transcribes the audio, and uses an AI agent to pinpoint the most engaging and relevant moments. It then leverages an FFMPEG microservice to automatically edit these moments into captivating short videos, complete with audio-synced subtitles optimized for mobile viewing.

## 🏗️ System Architecture

The application is built with a modern, scalable architecture that separates the user-facing frontend from the intensive processing backend.

### High-Level Overview

1.  **Frontend (Next.js & Vercel):** The user interacts with a web application to upload their long-form video. The video is uploaded directly to an AWS S3 bucket.
2.  **Queue System (Inngest):** Once the upload is complete, an event is sent to Inngest, our queueing system, to signal that a new video needs to be processed.
3.  **Backend (Python, Modal & FFMPEG):** An Inngest function triggers our serverless backend, which is deployed on Modal. This backend service, running on powerful GPUs, performs the heavy lifting:
    *   **Downloads** the video from S3.
    *   **Transcribes** the audio to text.
    *   **Identifies** key moments using an AI model.
    *   **Generates** clips using FFMPEG, adding animated, audio-synced subtitles.
4.  **Storage & Database:** The final clips are uploaded back to S3, and the video's status and clip information are updated in our database (managed via Prisma).
5.  **Payments (Stripe):** Clipper uses a credit-based system. Users can purchase credits via Stripe, and each generated clip deducts from their credit balance.

### Visual Diagrams

*(These diagrams illustrate the core workflows of the application.)*

**Clip Creation Flow:**
![image](https://github.com/user-attachments/assets/80503595-9c6c-4c5c-aeb4-4a67d99514de)

**Queue System with Inngest:**
![image](https://github.com/user-attachments/assets/7cbb228a-bd8b-46f9-9e46-af79f0e14184)

**Serverless GPU Backend with Modal:**
![image](https://github.com/user-attachments/assets/f250c6fe-1755-472b-8c92-b91b11f36c13)

**Stripe Purchase Flow:**
![image](https://github.com/user-attachments/assets/ba06cfb8-c0bd-4fb9-a03d-1098f4224c59)

---

## 🛠️ Repository Structure

The project is organized into two main parts: a `frontend` Next.js application and a `backend` Python service.

### `/frontend`

This directory contains the user-facing web application built with Next.js.

*   `src/app/`: The main application code, including pages, API routes, and components.
    *   `api/inngest/route.ts`: Defines the Inngest function that triggers the backend processing.
    *   `api/stripe/`: Handles Stripe webhooks for processing payments.
*   `prisma/`: Contains the database schema (`schema.prisma`) for our models (User, Video, etc.).
*   `public/`: Static assets for the frontend.
*   `components/`: Reusable React components.
*   `package.json`: Lists all frontend dependencies.

### `/backend`

This directory contains the serverless Python microservice responsible for all the heavy video processing logic. It's designed to run on [Modal](https://modal.com/).

*   `main.py`: The core of the backend service. It includes the logic for:
    *   Downloading videos from S3.
    *   Transcribing audio using an AI speech-to-text model.
    *   Analyzing the transcript to find interesting segments.
    *   Using FFMPEG to cut the video and add generated subtitles.
    *   Uploading the final clips back to S3.
*   `requirements.txt`: A list of all Python dependencies required for the backend (e.g., `modal`, `ffmpeg-python`, `openai`).
*   `yt-downloader.py`: A utility script for downloading videos directly from YouTube.

## ⚙️ Technology Stack

*   **Frontend:** Next.js, React, Tailwind CSS, shadcn/ui
*   **Backend:** Python, Modal
*   **Video Processing:** FFMPEG
*   **AI & Transcription:** OpenAI (or a similar service)
*   **Queueing:** Inngest
*   **Database:** PostgreSQL with Prisma ORM
*   **Payments:** Stripe
*   **Cloud Storage:** AWS S3
*   **Deployment:** Vercel (for frontend), Modal (for backend)

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js and npm
*   Python 3.8+ and pip
*   An AWS S3 account
*   A Stripe developer account
*   A Modal account

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/0xadityaa/clipper.git
    cd clipper
    ```
2.  **Set up the Frontend**
    ```sh
    cd frontend
    npm install
    cp .env.example .env.local
    ```
    *Fill in the environment variables in `.env.local` with your keys for Stripe, AWS, Prisma, etc.*
3.  **Set up the Backend**
    ```sh
    cd ../backend
    pip install -r requirements.txt
    ```
    *You will also need to configure your Modal credentials.*

4.  **Run the application**
    *   Start the frontend development server:
        ```sh
        cd ../frontend
        npm run dev
        ```
    *   Deploy the backend service to Modal:
        ```sh
        cd ../backend
        modal deploy main.py
        ```

---

Built with ❤️ at Hack AI Toronto.
