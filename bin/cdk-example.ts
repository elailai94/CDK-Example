#!/usr/bin/env node

import * as cdk from "aws-cdk-lib";

import { CdkExampleStack } from "../lib/cdk-example-stack";

const app = new cdk.App();
const stack = new CdkExampleStack(app, "CdkExampleStack");

cdk.Tags.of(stack).add("App", "Example");
cdk.Tags.of(stack).add("Environment", "Development");
