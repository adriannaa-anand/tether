# ◎ Tether — Mental Health Companion App

> A quiet space for social anxiety, burnout, loneliness, and grief.

![AWS](https://img.shields.io/badge/AWS-Deployed-orange?logo=amazon-aws)
![Terraform](https://img.shields.io/badge/IaC-Terraform-purple?logo=terraform)
![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![DynamoDB](https://img.shields.io/badge/Database-DynamoDB-blue?logo=amazon-dynamodb)

> This repo contains the **React frontend**, **Express.js backend**, **Terraform infrastructure**, and **CI/CD pipeline config** — everything needed to reproduce this project from scratch.

---

## 🌐 Live Demo

**Frontend:** [http://tether-adriannaa-website.s3-website.us-east-2.amazonaws.com](http://tether-adriannaa-website.s3-website.us-east-2.amazonaws.com)

---

## 📖 About

Tether is a mental health companion app designed for people dealing with social anxiety, burnout, loneliness, and grief. Unlike generic wellness apps, Tether focuses on the feelings that are hardest to name — and provides gentle, judgment-free tools to navigate them.

No social feed. No followers. Just you, gently supported.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Auth** | Secure register/login with JWT + bcrypt password hashing |
| 😊 **Mood Check-In** | Daily mood tracking with feelings tags, notes, and history |
| ◎ **Anonymous Connect** | Get matched with someone feeling something similar — no names needed |
| ⚡ **Burnout Tracker** | Rate yourself across 5 dimensions and track patterns over time |
| 📓 **Grief Journal** | Private journaling with guided prompts and delete support |

---

## 🏗️ Architecture

```
GitHub → AWS CodePipeline → AWS CodeBuild → S3 (React Frontend)
                                                      ↕
                                          EC2 (Express.js Backend)
                                                      ↕
                                               DynamoDB Tables
```

### AWS Services Used

| Service | Purpose |
|---|---|
| **S3** | Static website hosting for the React frontend |
| **CodePipeline** | CI/CD pipeline — auto deploys on every push to main |
| **CodeBuild** | Builds the React app (`npm run build`) |
| **EC2** | Hosts the Express.js backend (Ubuntu 22.04 + PM2) |
| **DynamoDB** | NoSQL database for all user data |
| **IAM** | Least-privilege roles for CodePipeline and CodeBuild |

### DynamoDB Tables

| Table | Partition Key | Sort Key | Description |
|---|---|---|---|
| `tether-users` | `userId` | — | User accounts (email GSI for login) |
| `tether-moods` | `userId` | `createdAt` | Mood check-ins per user |
| `tether-journal` | `userId` | `createdAt` | Journal entries per user |
| `tether-burnout` | `userId` | `createdAt` | Burnout assessment scores |

---

## 🚀 CI/CD Pipeline

Every push to `main` automatically triggers:

```
GitHub Push
    ↓
AWS CodePipeline (Source Stage)
    ↓
AWS CodeBuild (Build Stage — npm run build)
    ↓
Amazon S3 (Deploy Stage — static website)
```

The entire pipeline was provisioned using **Terraform** — no manual setup in the AWS console.

---

## 🛠️ Tech Stack

**Frontend**
- React 18
- Custom CSS (baby blue & pastel green theme)
- Hosted on AWS S3 as a static website

**Backend**
- Node.js + Express.js
- JWT Authentication
- bcryptjs for password hashing
- AWS SDK v3 for DynamoDB
- PM2 for process management
- Hosted on AWS EC2 (Ubuntu 22.04)

**Infrastructure (IaC)**
- Terraform
- Remote state stored in S3
- State locking via DynamoDB
- Modular structure — IAM module + Pipeline module
- IAM roles with least-privilege policies

---

## 📁 Project Structure

```
tether/
├── src/                          ← React frontend
│   ├── App.jsx
│   ├── App.css
│   ├── api.js                    ← API helper (all fetch calls)
│   ├── index.js
│   └── pages/
│       ├── Auth.jsx              ← Login & Register
│       ├── Landing.jsx           ← Home page
│       ├── MoodCheckIn.jsx       ← Daily mood tracker
│       ├── AnonymousMatch.jsx    ← Anonymous connect feature
│       ├── BurnoutTracker.jsx    ← Burnout assessment
│       └── GriefJournal.jsx      ← Private journal
├── public/
│   └── index.html
├── server/
│   ├── index.js                  ← Express.js backend
│   ├── package.json
│   └── .env.example
├── modules/
│   ├── iam/                      ← Terraform IAM module
│   │   ├── main.tf
│   │   └── outputs.tf
│   └── pipeline/                 ← Terraform pipeline module
│       ├── main.tf
│       └── outputs.tf
├── main.tf                       ← Root Terraform config
├── variables.tf
├── backend.tf                    ← Remote state config
├── outputs.tf
├── buildspec.yml                 ← CodeBuild build spec
└── package.json
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 20+
- AWS CLI configured
- AWS account with DynamoDB tables created

### Frontend
```bash
npm install
npm start
```
Runs on `http://localhost:3000`

### Backend
```bash
cd server
npm install
cp .env.example .env
# Fill in your AWS credentials and JWT secret
npm start
```
Runs on `http://localhost:8080`

### Environment Variables (`server/.env`)
```
AWS_REGION=us-east-2
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
JWT_SECRET=your-jwt-secret
PORT=8080
```

---

## 🏗️ Infrastructure Setup (Terraform)

### Prerequisites
- Terraform installed
- AWS CLI configured
- S3 bucket for remote state (created manually once)
- DynamoDB table for state locking (created manually once)

### Deploy
```bash
# Initialize backend
terraform init

# Preview changes
terraform plan

# Deploy all infrastructure
terraform apply
```

### What Terraform provisions
- IAM roles for CodePipeline and CodeBuild with least-privilege policies
- S3 buckets for artifacts and website hosting
- CodeBuild project
- Full CodePipeline (Source → Build → Deploy)
- S3 website configuration

---

## 🗄️ DynamoDB Setup

Create the 4 tables in AWS:

```bash
aws dynamodb create-table --table-name tether-users \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST --region us-east-2

aws dynamodb create-table --table-name tether-moods \
  --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=createdAt,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH AttributeName=createdAt,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST --region us-east-2

aws dynamodb create-table --table-name tether-journal \
  --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=createdAt,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH AttributeName=createdAt,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST --region us-east-2

aws dynamodb create-table --table-name tether-burnout \
  --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=createdAt,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH AttributeName=createdAt,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST --region us-east-2
```

Also create the email GSI on `tether-users` for login:
```bash
aws dynamodb update-table --table-name tether-users \
  --attribute-definitions AttributeName=email,AttributeType=S \
  --global-secondary-indexes '[{"IndexName":"email-index","KeySchema":[{"AttributeName":"email","KeyType":"HASH"}],"Projection":{"ProjectionType":"ALL"}}]' \
  --billing-mode PAY_PER_REQUEST --region us-east-2
```

---

## 🔐 Security Notes

- Never commit `.env` files — use `.env.example` as a template
- IAM roles follow least-privilege principle
- Passwords are hashed with bcrypt before storage
- JWT tokens expire after 7 days

---

## 👩‍💻 Author

**Adriannaa Anand**
- GitHub: [@adriannaa-anand](https://github.com/adriannaa-anand)
- LinkedIn: [Adriannaa Anand](https://linkedin.com/in/adriannaa-anand)

---

## 📄 License

MIT License
<img width="1917" height="902" alt="Tether s3 " src="https://github.com/user-attachments/assets/6a60e309-9ea6-454d-b63f-12ffc3af1731" />
<img width="1918" height="915" alt="Tether EC2" src="https://github.com/user-attachments/assets/3db24a86-7b05-455c-bf10-46e2b6fe5bab" />
<img width="1918" height="826" alt="dynamoDB" src="https://github.com/user-attachments/assets/67db95b1-cdc2-4f7c-a657-510fc815b683" />
<img width="1918" height="911" alt="Tether codepipeline" src="https://github.com/user-attachments/assets/3c5995c0-1a65-4baa-956a-796d3f68a897" />
<img width="1919" height="969" alt="image" src="https://github.com/user-attachments/assets/a5b08d35-4e80-49ac-82f8-4d8932db26b6" />
<img width="1901" height="907" alt="image" src="https://github.com/user-attachments/assets/50670a10-2829-4f00-a1fb-404878e63917" />
<img width="1919" height="914" alt="image" src="https://github.com/user-attachments/assets/9cde82f8-3960-4f4d-a7d6-08ced46bb9be" />
<img width="1912" height="914" alt="image" src="https://github.com/user-attachments/assets/77ac11a2-653a-4dc8-b01c-d3b512d8dc25" />
<img width="1917" height="916" alt="image" src="https://github.com/user-attachments/assets/d4246fd4-5d59-4431-97a8-31ecd9eab5fe" />


