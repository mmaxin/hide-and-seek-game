# Rhodes example-photo capture list

The Examples page is ready for eight local image files. Capture or export the exact frame shown by each source link, then add the files to this directory.

| File | Source |
| --- | --- |
| `complete-scene-one.webp` | Added from the supplied image |
| `complete-scene-two.webp` | Added from the supplied image |
| `cropped-sign.webp` | Added from the supplied image |
| `cropped-door.webp` | Added from the supplied image |
| `zoom-hides-missing-sign.webp` | Added from the issue attachment |
| `unclear-sign.webp` | Added from the supplied image |
| `road-out-of-frame-one.webp` | Added from the supplied image |
| `road-out-of-frame-two.webp` | Added from the supplied image |

## Capture requirements

- Use an image you own or have permission to publish. Do not scrape a Google Maps thumbnail.
- Preserve the original framing. Do not crop out the flaw the example is teaching.
- Export as WebP at a visually high quality, ideally no more than 1600 pixels on the longest edge and under 500 KB.
- Remove GPS and other EXIF metadata before publishing.
- Check the matching alternative text in `_data/rhodes_photo_examples.yml` and adjust it if the actual image needs a more precise description.
- Set that example's `image` value to `/assets/examples/rhodes/FILENAME.webp` in `_data/rhodes_photo_examples.yml`.

The page displays a labelled placeholder until the `image` value is filled in, so missing files never render as broken images.

All eight example images are installed and connected to their cards.
