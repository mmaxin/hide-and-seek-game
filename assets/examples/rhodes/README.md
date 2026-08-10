# Rhodes example-photo capture list

The Examples page is ready for eight local image files. Capture or export the exact frame shown by each source link, then add the files to this directory.

| File | Source |
| --- | --- |
| `complete-scene-one.jpg` | https://maps.app.goo.gl/BDgJaVZrNfLYPu5E7 |
| `complete-scene-two.jpg` | https://maps.app.goo.gl/eyxECpM2pVsxTZvM6 |
| `cropped-sign.jpg` | https://maps.app.goo.gl/1CMuUXssUnCxcpVLA |
| `cropped-door.jpg` | https://maps.app.goo.gl/yHdib3PV7LbdyoH6A |
| `zoom-hides-missing-sign.jpg` | https://github.com/user-attachments/assets/84f4cb33-dfb4-4024-a125-d50cb09d53b7 |
| `unclear-sign.jpg` | https://maps.app.goo.gl/rkh1LCdoxfKuEZj48 |
| `road-out-of-frame-one.jpg` | https://maps.app.goo.gl/Vg89YvqMhTAoztnBA |
| `road-out-of-frame-two.jpg` | https://maps.app.goo.gl/TbHmC5wUcNk6S24SA |

## Capture requirements

- Use an image you own or have permission to publish. Do not scrape a Google Maps thumbnail.
- Preserve the original framing. Do not crop out the flaw the example is teaching.
- Export as JPEG, ideally 1400-1800 pixels wide and under 500 KB.
- Remove GPS and other EXIF metadata before publishing.
- Check the matching alternative text in `_data/rhodes_photo_examples.yml` and adjust it if the actual image needs a more precise description.
- Set that example's `image` value to `/assets/examples/rhodes/FILENAME.jpg` in `_data/rhodes_photo_examples.yml`.

The page displays a labelled placeholder until the `image` value is filled in, so missing files never render as broken images.
