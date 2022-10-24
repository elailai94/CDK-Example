import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as keyPair from "cdk-ec2-key-pair";
import * as path from "path";
import * as s3Assets from "aws-cdk-lib/aws-s3-assets";

import { Construct } from "constructs";

export class CdkExampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Look up the default VPC
    const vpc = ec2.Vpc.fromLookup(this, "VPC", {
      isDefault: true,
    });

    // Create a key pair to be used with this EC2 instance
    const key = new keyPair.KeyPair(this, "KeyPair", {
      description: "Key Pair created with CDK Deployment",
      name: "cdk-keypair",
    });
    key.grantReadOnPublicKey;

    // Security group for the EC2 instance
    const securityGroup = new ec2.SecurityGroup(this, "SecurityGroup", {
      allowAllOutbound: true,
      description: "Allow SSH (TCP port 22) and HTTP (TCP port 80) in",
      vpc,
    });

    // Allow SSH access on port tcp/22
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      "Allow SSH Access"
    );

    // IAM role to allow access to other AWS services
    const role = new iam.Role(this, "ec2Role", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
    });

    // IAM policy attachment to allow access to
    role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore")
    );

    // Look up the AMI ID for the Amazon Linux 2 Image with CPU Type X86_64
    const ami = new ec2.AmazonLinuxImage({
      cpuType: ec2.AmazonLinuxCpuType.X86_64,
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
    });

    // Create the EC2 instance using the Security Group, AMI and KeyPair defined
    const ec2Instance = new ec2.Instance(this, "Instance", {
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO
      ),
      keyName: key.keyPairName,
      machineImage: ami,
      role,
      securityGroup,
      vpc,
    });
  }
}
