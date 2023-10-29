---
title: Automated Content Publishing for Free using Github Actions
description: Describing my Github Actions CI/CD setup for automated publishing on my personal blogging site.
date: 2022-10-29
tags:
  - website updates
  - github actions
  - CI/CD
draft: true
---

It's been a week since I set up my personal blogging site and wrote my [first article]({% link_to "/blog/hello-world/" %}), and now I'm writing my second one! This is definitely a good sign and I'm feeling positive for the future of this blog thing.

Anyways, let's now talk about the main topic of this article: setting up automated publishing of this blog site using Github Actions, why I need one and how I did it.

## The Aim for Maximum Convenience

For context, I'll start with describing the steps on how I published the updated blog site together with the [first blog post]({% link_to "/blog/hello-world/" %}). Here are they:

1. Write the blog post.
2. Build the whole blog site with the command `npm run build`.
3. Login to AWS Console.
4. Go to S3 and upload the built static pages to the S3 Bucket.
5. Go to CloudFront and create a cache invalidation.
6. Commit and push the changes to the [git repository](https://github.com/andyautida14/personal-website).

There are only 6 steps so it doesn't look like it's too much of a hassle. However, as a software engineer, I believe that to achieve the ultimate effectivity and efficiency, we must give all the work that can be done by machines to machines, and leave all the work that can only be done by humans to humans.

Thus, I decided to automate all steps that can be automated, namely the steps 2 to 5. Once it's properly set up, I can then spend all my time, energy and brain power to just writing the blog post.

## Automating The Stuff

1. Setup IAM Policy and User
2. Define GitHub Actions Secrets
3. Write the GitHub Action workflow

## Conclusion