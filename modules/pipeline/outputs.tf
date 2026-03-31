output "website_bucket" {
  value = aws_s3_bucket.website.bucket
}

output "pipeline_name" {
  value = aws_codepipeline.pipeline.name
}