$htmlFiles = Get-ChildItem -Path "categories" -Filter "*.html"
foreach ($file in $htmlFiles) {
    $content = Get-Content -Raw -Path $file.FullName
    $content = $content -replace "row-cols-2 g-2", "row-cols-2 row-cols-md-3 g-2"
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
}
