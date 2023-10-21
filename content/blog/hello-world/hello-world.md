---
title: Hello World!
description: Introducing my new personal blogging site.
date: 2022-10-22
tags: website updates
---

Several years ago, I bought the domain for this website planning of turning it into some sort of a personal portfolio and blogging website. Then I quickly made a very simple page with my face, name and link to my social accounts. It's very crude and has no useful content whatsoever, but I'm quite satisfied with what I've accomplished so far. I just have slowly add more functionality and content over time to turn it into an awesome blog, right? ...Right?

{% image "./initial-website.png", "What this website looks like before." %}

Well, it should be obvious by now that I haven't made any improvements to it since it was initially created. It's not because I am a perfectionist who eventually got overwhelmed trying to make the perfect blog site, or a super-busy individual who has a lot of responsibilities in life. I just somehow lost interest in it and moved on to other things that hold my interest more. Also, I vaguely felt that I don't have anything to show for. I am yet to have stories that other people might find interesting to read.

## Coherence of the Scattered Interests

I got exposed to a lot of programming-related stuff at work, some are more interesting than others. Those which are more interesting are studied more extensively. Other interesting stuff that I can't use at work, I used in my personal side-projects.

I also picked up some hobbies like fitness (specifically Calisthenics), practicing instruments (guitar and bass), 3D Printing and Basketball. I even fully nerded-out in all-things fitness that I think it became my second area of expertise after Software Engineering.

The most interesting, inspiring and gratifying activities are the intersection of two or more interests. I've had only one before (blog post coming soon), but I feel positive that there will be more in the future.

Recently, I got inspired to a bunch of ideas for side-projects that are a quite ambitious, but should certainly be within my capabilities. Then I thought, "It would a shame if I don't document it." And thus, now I have the content. I now only have to setup the blog site.

## Setting Up the Blog Site

When I made the initial version of the website, I want it to be super cheap and requires no operational burden on my part. That's why I chose AWS S3 and CloudFront to host my website. My lone static HTML file was stored in S3, and CloudFront caches and serves it to the visitor. This is the simplest and cheapest way to set up a static website in AWS. I have no hopes of ever exceeding the free-tier thresholds every month, since nobody's visiting my website aside from me anyway.

Starting now, I'm going to make new blog posts every now and then. I still want it to be as cost-efficient as possible, that's why it will still remain as a static website. But coding HTML pages by hand everytime I make a post will be super tedious, it might actually discourage me from making a blog post. What I generally want is to write the article on some Markdown file, commit and push it into GitHub, and let GitHub Actions handle the uploading to S3 and invalidation of the CloudFront distribution.

That's why I need a good static website generator, and I found [Eleventy](https://www.11ty.dev/) which I think supports all the features I need for the blog, and much more. I initially thought of making one myself, but I'm pleasantly surprised that today's static website generators are pretty good.

First, I skimmed through their documentation to check out their features, and then I found that they already have this [Eleventy Base Blog](https://github.com/11ty/eleventy-base-blog), which is neat, because I don't have to start from scratch, even though starting from scratch is also not that bad since it looks very easy to use.

I then updated the home page a little bit to add my picture, name and link to social accounts, and now I have a blog site!

Although Eleventy is very easy to learn and use, it's still a bit rough around the edges. Specifically, I think there's a bug that prevents hot reloading of contents. Restarting the local server everytime I make a change is kind of annoying, but I can live with it for now. Maybe there's just something that's broken in my configurations, but for now, it's still adequately serviceable.

## What's Next?

While the website is still in it's infancy, there are still a few things I want to work on, like SEO and GitHub Actions for deployment and posting to my social media accounts. If I find that those updates are interesting or can be useful to others, I might make blog posts on them. A blog post about the blog site, if you will.

Now, there's also a chance that there will never be a new post after this one. But I have a feeling that that's not going to be the case this time. It might take some time, but I feel that the second blog post is coming soon.

If that ever happens, I hope to see you there as well!