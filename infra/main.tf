data "aws_caller_identity" "current" {}

provider "aws" {
  region = local.region
}

# DNS

resource "aws_route53_zone" "this" {
  name    = local.domain
  comment = "TerraNext"
}

resource "aws_kms_key" "this" {
  customer_master_key_spec = "ECC_NIST_P256"
  deletion_window_in_days  = 7
  key_usage                = "SIGN_VERIFY"
  policy = jsonencode({
    Statement = [
      {
        Action = [
          "kms:DescribeKey",
          "kms:GetPublicKey",
          "kms:Sign",
          "kms:Verify",
        ],
        Effect = "Allow"
        Principal = {
          Service = "dnssec-route53.amazonaws.com"
        }
        Resource = "*"
        Sid      = "Allow Route 53 DNSSEC Service",
      },
      {
        Action = "kms:*"
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Resource = "*"
        Sid      = "Enable IAM User Permissions"
      },
    ]
    Version = "2012-10-17"
  })
}

resource "aws_route53_key_signing_key" "this" {
  name                       = "terranext-dnssec-ksk"
  hosted_zone_id             = aws_route53_zone.this.zone_id
  key_management_service_arn = aws_kms_key.this.arn
}

resource "aws_route53_hosted_zone_dnssec" "this" {
  hosted_zone_id = aws_route53_zone.this.zone_id

  depends_on = [aws_route53_key_signing_key.this]
}

# ACM

resource "aws_acm_certificate" "this" {
  region = "us-east-1"

  domain_name               = local.domain
  subject_alternative_names = ["*.${local.domain}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "validation" {
  for_each = {
    for dvo in aws_acm_certificate.this.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = aws_route53_zone.this.zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60

  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "this" {
  region = "us-east-1"

  certificate_arn         = aws_acm_certificate.this.arn
  validation_record_fqdns = [for record in aws_route53_record.validation : record.fqdn]
}

# Terranext

module "terranext" {
  source = "oliverphardman/opennext/aws"

  name                = "TerraNext"
  slug                = "terranext"
  aws_region          = local.region
  opennext_build_path = "../.open-next"
  deployment_domain   = local.domain
  acm_arn             = aws_acm_certificate_validation.this.certificate_arn
  hosted_zone_id      = aws_route53_zone.this.zone_id
  create_dns_records  = true
}