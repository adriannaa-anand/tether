variable "aws_region" {
  default = "us-east-2"
}

variable "project_name" {
  default = "Tether"
}

variable "github_repo" {
  description = "GitHub repo in format owner/repo"
}

variable "github_branch" {
  default = "main"
}

variable "codestar_connection_arn" {
  description = "ARN of the CodeStar connection to GitHub"
}