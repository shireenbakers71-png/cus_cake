$templatePath = 'c:\Users\PC\Desktop\cus_cake\categories\birthday-cakes.html'
$htmlContent = Get-Content -Raw -Path $templatePath

function Get-CakeHtml {
    param($TitleCase, $UpperTitle, $FolderName, $OutputName)
    $images = Get-ChildItem -Filter *.webp "c:\Users\PC\Desktop\cus_cake\images\$FolderName" | Select-Object -ExpandProperty Name
    $jsonArray = ($images | ConvertTo-Json -Compress) -join ''
    # If the array has only 1 element
    if ($images.Count -eq 1) { $jsonArray = "`["" + $images[0] + ""`]" }
    
    # Replace `<title>`
    $newContent = $htmlContent -replace 'Birthday Cakes \| Shireen Bakers', "$TitleCase Cakes | Shireen Bakers"
    
    # Replace `<h2 class="page-title m-0">BIRTHDAY <span>CAKES</span></h2>`
    $newContent = $newContent -replace 'BIRTHDAY <span>CAKES</span>', "$UpperTitle <span>CAKES</span>"
    
    # Replace image folder path
    $newContent = $newContent -replace '\.\./images/birthday_cakes_400/', "../images/$FolderName/"
    
    # Replace `alt="Birthday Cake"`
    $newContent = $newContent -replace 'alt="Birthday Cake"', "alt=`"$TitleCase Cake`""
    
    # Replace the JS array. Regex to match `const imageFiles = [ ... ];`
    $regex = '(?s)const imageFiles = \[.*?\];'
    $newContent = $newContent -replace $regex, "const imageFiles = $jsonArray;"
    
    Set-Content -Path "c:\Users\PC\Desktop\cus_cake\categories\$OutputName" -Value $newContent -Encoding UTF8
    Write-Output "Updated $OutputName"
}

Get-CakeHtml -TitleCase 'Cartoon' -UpperTitle 'CARTOON' -FolderName 'cartoon_cakes' -OutputName 'cartoon-cakes.html'
Get-CakeHtml -TitleCase 'Marvel' -UpperTitle 'MARVEL' -FolderName 'marvel_cakes' -OutputName 'marvel-cakes.html'
Get-CakeHtml -TitleCase 'Popsicle' -UpperTitle 'POPSICLE' -FolderName 'popsi_cakes' -OutputName 'popsicle-cakes.html'
