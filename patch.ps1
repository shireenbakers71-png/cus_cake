$htmlFiles = Get-ChildItem -Path "categories" -Filter "*.html"
foreach ($file in $htmlFiles) {
    $content = Get-Content -Raw -Path $file.FullName
    $content = $content -replace "row-cols-3 g-2", "row-cols-2 g-2"
    $content = $content -replace "1/2 pounds", "1/2 lbs"
    $content = $content -replace "1 Pound", "1 lb"
    $content = $content -replace "2 Pounds", "2 lbs"
    $content = $content -replace "Custom Pounds", "Custom lbs"
    $content = $content -replace "Enter pounds", "Enter lbs"
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
}
