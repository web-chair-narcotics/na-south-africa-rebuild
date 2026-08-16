# Media and Downloadable Asset Intake

The rebuild accepts public media exports without requiring administrator credentials. The preferred package is a ZIP of the source `uploads` or media-library directory plus `media_manifest.csv`. The manifest should contain `original_url`, `relative_file_path`, `filename`, `mime_type`, `file_size`, `alt_text`, `caption`, `source_page`, and `last_modified`.

The intake workflow is deliberately separated from publication. First, archive the supplied ZIP outside the deployable source tree and calculate a checksum for each file. Next, parse the manifest and normalize public source URLs. Then map each asset to the page or meeting record that references it, flagging missing files, duplicate filenames, unsupported formats, and assets without alt text. Finally, upload approved public assets to managed object storage and replace legacy references only after the page-level review decision is recorded.

Private exports, backups, database dumps, credentials, session cookies, server configuration, and administrator edit URLs must not enter the public asset library. PDFs and downloadable literature should remain linked through verified managed storage URLs; raw local files must not be placed inside the web project deployment directory.

The current source package contains WordPress attachment metadata but not a complete media-library ZIP. Consequently, the attachment register is complete as metadata, while binary asset transfer and page-by-page asset verification remain pending until a public media archive is supplied.

## Current execution

The reusable intake runner has been executed against the uploaded WordPress attachment metadata. It inventoried **154 attachment records** with no duplicate filenames or missing manifest entries in metadata-only mode. Because no binary media-library ZIP or `media_manifest.csv` was supplied, the workflow has not performed archive extraction, checksum comparison, managed-storage upload, or binary-to-page linkage verification. Those steps remain explicitly pending until the public media archive is uploaded.
