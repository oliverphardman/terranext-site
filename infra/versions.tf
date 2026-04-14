terraform {
  required_version = ">=1.1"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.2"
    }
  }

  backend "s3" {
    bucket  = "terranext-tfstate-114171679577-us-east-1-an"
    key     = "terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}
