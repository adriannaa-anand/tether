terraform {
  backend "s3" {
    bucket         = "my-terraform-bucket-state-3"
    key            = "cicd/terraform.tfstate"
    region         = "us-east-2"
    dynamodb_table = "terraform-lock"
    encrypt        = true
  }
}