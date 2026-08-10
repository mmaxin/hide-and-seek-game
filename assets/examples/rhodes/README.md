# Rhodes example-photo capture list

The Examples page is ready for eight local image files. Capture or export the exact frame shown by each source link, then add the files to this directory.

| File | Source |
| --- | --- |
| `complete-scene-one.png` | Added from the supplied image |
| `complete-scene-two.png` | Added from the supplied image |
| `cropped-sign.png` | Added from the supplied image |
| `cropped-door.png` | Added from the supplied image |
| `zoom-hides-missing-sign.png` | Added from the issue attachment |
| `unclear-sign.png` | Added from the supplied image |
| `road-out-of-frame-one.png` | Added from the supplied image |
| `road-out-of-frame-two.png` | Added from the supplied image |

## Capture requirements

- Use an image you own or have permission to publish. Do not scrape a Google Maps thumbnail.
- Preserve the original framing. Do not crop out the flaw the example is teaching.
- Export as JPEG, ideally 1400-1800 pixels wide and under 500 KB.
- Remove GPS and other EXIF metadata before publishing.
- Check the matching alternative text in `_data/rhodes_photo_examples.yml` and adjust it if the actual image needs a more precise description.
- Set that example's `image` value to `/assets/examples/rhodes/FILENAME.jpg` in `_data/rhodes_photo_examples.yml`.

The page displays a labelled placeholder until the `image` value is filled in, so missing files never render as broken images.

All eight example images are installed and connected to their cards.
