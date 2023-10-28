const path = require("path");
const eleventyImage = require("@11ty/eleventy-img");

module.exports = eleventyConfig => {
	function relativeToInputPath(inputPath, relativeFilePath) {
		let split = inputPath.split("/");
		split.pop();

		return path.resolve(split.join(path.sep), relativeFilePath);
	}

	// Eleventy Image shortcode
	// https://www.11ty.dev/docs/plugins/image/
	eleventyConfig.addAsyncShortcode("image", async function imageShortcode(src, alt, widths, sizes) {
		// Full list of formats here: https://www.11ty.dev/docs/plugins/image/#output-formats
		// Warning: Avif can be resource-intensive so take care!
		let formats = ["avif", "webp", "auto"];
		let file = relativeToInputPath(this.page.inputPath, src);
		let metadata = await eleventyImage(file, {
			widths: widths || ["auto"],
			formats,
			outputDir: path.join(eleventyConfig.dir.output, "img"), // Advanced usage note: `eleventyConfig.dir` works here because we’re using addPlugin.
		});

		// TODO loading=eager and fetchpriority=high
		let imageAttributes = {
			alt,
			sizes,
			loading: "lazy",
			decoding: "async",
		};
		return eleventyImage.generateHTML(metadata, imageAttributes);
	});

  eleventyConfig.addAsyncShortcode('blogImage', async function imageShortcode(src, caption) {
		let file = relativeToInputPath(this.page.inputPath, src)

		let metadata = await eleventyImage(file, {
			widths: [360, 576, 768, 992, 'auto'],
			formats: ['auto'],
			outputDir: path.join(eleventyConfig.dir.output, 'img'),
		})

    const [ format ] = Object.keys(metadata)
    const images = metadata[format]
    const srcUrl = images[images.length - 1].url
    const srcset = metadata[format].map(m => m.srcset).join(', ')

    return `
      <figure class="blog-figure">
        <img
          loading="lazy"
          decoding="async"
          src="${srcUrl}"
          srcset="${srcset}"
          sizes="(max-width: 800px) 90vw, 40em"
        />
        <figcaption>${caption}</figcaption>
      </figure>
    `
	})
};
