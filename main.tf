provider "aws" {
  region = var.aws_region
}

module "iam" {
  source       = "./modules/iam"
  project_name = var.project_name
}

module "pipeline" {
  source                  = "./modules/pipeline"
  project_name            = var.project_name
  github_repo             = var.github_repo
  github_branch           = var.github_branch
  codepipeline_role_arn   = module.iam.codepipeline_role_arn
  codebuild_role_arn      = module.iam.codebuild_role_arn
  codestar_connection_arn = var.codestar_connection_arn
}