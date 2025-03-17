# 定义重命名映射
$folderMappings = @{
    "Men's  Coat & Jacket" = "mens-coat-jacket"
    "Ladies'  Coat" = "ladies-coat"
    "Ladies' Jacket" = "ladies-jacket"
    "Men's Wind Jacket" = "mens-wind-jacket"
    "Ladies' wind Coat" = "ladies-wind-coat"
    "CAPS" = "caps"
    "GLOVES" = "gloves"
    "Men's  SOCKS" = "mens-socks"
}

# 设置工作目录
$productPath = ".\images\product"

# 遍历映射并重命名文件夹
foreach ($oldName in $folderMappings.Keys) {
    $newName = $folderMappings[$oldName]
    $oldPath = Join-Path $productPath $oldName
    $newPath = Join-Path $productPath $newName
    
    if (Test-Path $oldPath) {
        Write-Host "Renaming '$oldName' to '$newName'"
        # 如果目标文件夹已存在，先删除它
        if (Test-Path $newPath) {
            Remove-Item -Path $newPath -Recurse -Force
        }
        Rename-Item -Path $oldPath -NewName $newName -Force
    } else {
        Write-Host "Folder '$oldName' not found"
    }
} 