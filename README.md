# ◎ Tether — Mental Health Companion App

> A quiet space for social anxiety, burnout, loneliness, and grief.

![AWS](https://img.shields.io/badge/AWS-Deployed-orange?logo=amazon-aws)
![Terraform](https://img.shields.io/badge/IaC-Terraform-purple?logo=terraform)
![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)
![DynamoDB](https://img.shields.io/badge/Database-DynamoDB-blue?logo=amazon-dynamodb)

---

## 🌐 Live Demo

**Frontend:** [http://tether-adriannaa-website.s3-website.us-east-2.amazonaws.com](http://tether-adriannaa-website.s3-website.us-east-2.amazonaws.com)

---

## 📖 About

Tether is a mental health companion app designed for people dealing with social anxiety, burnout, loneliness, and grief. Unlike generic wellness apps, Tether focuses on the feelings that are hardest to name — and provides gentle, judgment-free tools to navigate them.

### Features

- **🔐 Auth** — Secure register/login with JWT authentication
- **😊 Mood Check-In** — Daily mood tracking with feelings tags and notes
- **◎ Anonymous Connect** — Get matched with someone feeling something similar, no names needed
- **⚡ Burnout Tracker** — Rate yourself across 5 dimensions and track patterns over time
- **📓 Grief Journal** — Private journaling with guided prompts

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
| **S3** | Static website hosting for React frontend |
| **CodePipeline** | CI/CD pipeline — auto deploys on every push |
| **CodeBuild** | Builds the React app |
| **EC2** | Hosts the Express.js backend |
| **DynamoDB** | NoSQL database for all user data |
| **IAM** | Roles and permissions |

### DynamoDB Tables

| Table | Description |
|---|---|
| `tether-users` | User accounts with email GSI |
| `tether-moods` | Mood check-ins per user |
| `tether-journal` | Journal entries per user |
| `tether-burnout` | Burnout assessment scores |

---

## 🛠️ Tech Stack

**Frontend**
- React 18
- CSS Modules (baby blue & pastel green theme)
- Hosted on AWS S3

**Backend**
- Node.js + Express.js
- JWT Authentication
- bcryptjs for password hashing
- AWS SDK v3 for DynamoDB
- PM2 for process management
- Hosted on AWS EC2

**Infrastructure (IaC)**
- Terraform
- Remote state on S3 + DynamoDB locking
- Modular structure (IAM, Pipeline modules)

---

## 🚀 CI/CD Pipeline

Every push to `main` triggers:

```
GitHub Push → CodePipeline → CodeBuild (npm run build) → Deploy to S3
```

The pipeline was fully provisioned using **Terraform**.

---

## 📁 Project Structure

```
tether/
├── src/
│   ├── App.jsx
│   ├── api.js               ← API helper
│   └── pages/
│       ├── Auth.jsx          ← Login & Register
│       ├── Landing.jsx       ← Home page
│       ├── MoodCheckIn.jsx   ← Mood tracker
│       ├── AnonymousMatch.jsx← Connect feature
│       ├── BurnoutTracker.jsx← Burnout assessment
│       └── GriefJournal.jsx  ← Private journal
├── public/
├── server/
│   ├── index.js             ← Express backend
│   └── package.json
├── modules/
│   ├── iam/                 ← Terraform IAM module
│   └── pipeline/            ← Terraform pipeline module
├── main.tf
├── variables.tf
├── backend.tf
├── outputs.tf
└── buildspec.yml            ← CodeBuild config
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

### Backend
```bash
cd server
npm install
cp .env.example .env
# Fill in your AWS credentials and JWT secret
npm start
```

### Environment Variables (server/.env)
```
AWS_REGION=us-east-2
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
JWT_SECRET=your-secret-key
PORT=8080
```

---

## 🏗️ Infrastructure Setup (Terraform)

```bash
# Initialize with remote state
terraform init

# Preview changes
terraform plan

# Deploy
terraform apply
```

---

## 👩‍💻 Author

**Adriannaa Anand**
- GitHub: [@adriannaa-anand](https://github.com/adriannaa-anand)
- LinkedIn: [Adriannaa Anand](https://linkedin.com/in/adriannaa-anand)

<img width="1917" height="902" alt="Tether s3 " src="https://github.com/user-attachments/assets/6a60e309-9ea6-454d-b63f-12ffc3af1731" />
<img width="1918" height="915" alt="Tether EC2" src="https://github.com/user-attachments/assets/3db24a86-7b05-455c-bf10-46e2b6fe5bab" />
<img width="1918" height="826" alt="dynamoDB" src="https://github.com/user-attachments/assets/67db95b1-cdc2-4f7c-a657-510fc815b683" />
<img width="1918" height="911" alt="Tether codepipeline" src="https://github.com/user-attachments/assets/3c5995c0-1a65-4baa-956a-796d3f68a897" />
<img width="1919" height="969" alt="image" src="https://github.com/user-attachments/assets/a5b08d35-4e80-49ac-82f8-4d8932db26b6" />
<img width="1901" height="907" alt="image" src="https://github.com/user-attachments/assets/50670a10-2829-4f00-a1fb-404878e63917" />
<img width="1919" height="914" alt="image" src="https://github.com/user-attachments/assets/9cde82f8-3960-4f4d-a7d6-08ced46bb9be" />
<img width="1912" height="914" alt="image" src="https://github.com/user-attachments/assets/77ac11a2-653a-4dc8-b01c-d3b512d8dc25" />
<img width="1917" height="916" alt="image" src="https://github.com/user-attachments/assets/d4246fd4-5d59-4431-97a8-31ecd9eab5fe" />


