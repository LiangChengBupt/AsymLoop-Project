# AsymLoop Project Page

Project website for **Asymmetric Looped Transformers: Fixed Global Representations for an Iterative Decoder**.

A static research page with the architecture, original paper figures, interactive results across four model scales, component ablations, and supporting analyses.

## Paper

[Read the full manuscript (PDF)](assets/paper/asymloop.pdf)

## Publish with GitHub Pages

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Choose **main** and **/(root)**, then click **Save**.
4. The project page will be available at **https://liangchengbupt.github.io/AsymLoop-Project/** after deployment completes.

## Preview locally

```bash
python3 -m http.server 8766
```

Open `http://localhost:8766/`. Use an HTTP server because the interactive results load JSON data.

## Files

- `index.html`: page content and layout.
- `style.css`: responsive styling.
- `app.js`: recurrence illustration, results explorer, and figure viewer.
- `assets/results.json`: reported seven-task results for all four scales and both evaluation settings.
- `assets/figures/`: web images and original vector PDFs.
- `assets/paper/asymloop.pdf`: public manuscript PDF.

Author details and affiliations are included; Zhouhan Lin is the corresponding author. A link to the public model implementation can be added when available. The website repository is separate from the model implementation.
