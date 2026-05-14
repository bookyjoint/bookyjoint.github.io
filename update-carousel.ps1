# PowerShell script to update carousel manifest
# Run this whenever you add/remove images from the images folder

param(
    [string]$ImagesDir = ".\images"
)

# Supported image extensions
$imageExtensions = @('.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp')

# Function to check if file is an image
function Is-ImageFile {
    param([string]$filename)
    $ext = [System.IO.Path]::GetExtension($filename).ToLowerCase()
    return $imageExtensions -contains $ext
}

# Function to generate alt text from filename
function Generate-AltText {
    param([string]$filename)
    $name = [System.IO.Path]::GetFileNameWithoutExtension($filename)
    # Replace underscores/hyphens with spaces and capitalize words
    $alt = $name -replace '[_-]', ' '
    return (Get-Culture).TextInfo.ToTitleCase($alt.ToLower())
}

try {
    # Get all files in images directory
    $files = Get-ChildItem -Path $ImagesDir -File | Where-Object { $_.Name -ne 'carousel-manifest.json' }

    # Filter for image files and sort alphabetically
    $imageFiles = $files | Where-Object { Is-ImageFile $_.Name } | Sort-Object Name

    # Create manifest entries
    $manifest = @()
    foreach ($file in $imageFiles) {
        $entry = @{
            src = "images/$($file.Name)"
            alt = Generate-AltText $file.Name
        }
        $manifest += $entry
    }

    # Convert to JSON and write file
    $json = $manifest | ConvertTo-Json
    $manifestPath = Join-Path $ImagesDir "carousel-manifest.json"
    $json | Out-File -FilePath $manifestPath -Encoding UTF8

    Write-Host "✅ Updated carousel-manifest.json with $($manifest.Count) images:" -ForegroundColor Green
    foreach ($item in $manifest) {
        Write-Host "   - $($item.src) ($($item.alt))" -ForegroundColor Cyan
    }

} catch {
    Write-Error "Error updating carousel manifest: $_"
}