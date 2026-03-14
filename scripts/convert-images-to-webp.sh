#!/bin/bash

# Convert all images to WebP format for consistency
# This script converts JPG, JPEG, and PNG files to WebP

echo "🖼️ Converting images to WebP format..."

# Find all image files and convert them
find public/images -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while read file; do
  # Get the base name without extension
  base="${file%.*}"
  webp_file="${base}.webp"
  
  # Skip if WebP already exists
  if [ -f "$webp_file" ]; then
    echo "⏭️  Skipping $file (WebP already exists)"
    continue
  fi
  
  echo "🔄 Converting: $file -> $webp_file"
  
  # Convert with quality 85 for good balance of size and quality
  convert "$file" -quality 85 "$webp_file"
  
  if [ $? -eq 0 ]; then
    echo "✅ Created: $webp_file"
    
    # Get file sizes for comparison
    original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    webp_size=$(stat -f%z "$webp_file" 2>/dev/null || stat -c%s "$webp_file" 2>/dev/null)
    
    if [ -n "$original_size" ] && [ -n "$webp_size" ]; then
      savings=$((original_size - webp_size))
      percent=$((savings * 100 / original_size))
      echo "📊 Size reduced by ${percent}% (${savings} bytes)"
    fi
  else
    echo "❌ Failed to convert: $file"
  fi
done

echo ""
echo "✨ Conversion complete!"
echo "📝 Now run: node scripts/update-image-links.js to update markdown files"
